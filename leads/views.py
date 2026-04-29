import csv
import io

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import Lead
from .serializers import LeadSerializer
from .scraper_google_maps import scrape_google_maps


class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        qs = Lead.objects.filter(user=self.request.user)
        status_filter = self.request.query_params.get('status')
        source_filter = self.request.query_params.get('source')
        search = self.request.query_params.get('search', '').strip()
        if status_filter:
            qs = qs.filter(status=status_filter)
        if source_filter:
            qs = qs.filter(source=source_filter)
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(company__icontains=search) | qs.filter(email__icontains=search)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def score(self, request, pk=None):
        from outreach.ai import score_lead
        lead = self.get_object()
        result = score_lead(lead)
        lead.score = result['score']
        lead.score_reasoning = result['reasoning']
        lead.save()
        return Response({'score': lead.score, 'reasoning': lead.score_reasoning})

    @action(detail=False, methods=['post'], url_path='import_csv', parser_classes=[MultiPartParser, FormParser])
    def import_csv(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            content = file.read().decode('utf-8-sig')
            reader = csv.DictReader(io.StringIO(content))
            created = 0
            for row in reader:
                Lead.objects.create(
                    user=request.user,
                    name=row.get('name', '').strip(),
                    company=row.get('company', '').strip(),
                    email=row.get('email', '').strip(),
                    phone=row.get('phone', '').strip(),
                    website=row.get('website', '').strip(),
                    address=row.get('address', '').strip(),
                    notes=row.get('notes', '').strip(),
                    source='csv',
                )
                created += 1
            return Response({'created': created})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def scrape(self, request):
        query = request.data.get('query', '').strip()
        location = request.data.get('location', '').strip()
        if not query:
            return Response({'error': 'query is required'}, status=status.HTTP_400_BAD_REQUEST)
        results = scrape_google_maps(query, location)
        if not results:
            return Response({'error': 'No results returned. Check your GOOGLE_MAPS_API_KEY.'}, status=status.HTTP_400_BAD_REQUEST)
        created = 0
        for r in results:
            Lead.objects.create(
                user=request.user,
                name=r.get('name', ''),
                company=r.get('name', ''),
                phone=r.get('phone', ''),
                website=r.get('website', ''),
                address=r.get('address', ''),
                category=r.get('category', ''),
                source='google_maps',
            )
            created += 1
        return Response({'created': created, 'results': results})
