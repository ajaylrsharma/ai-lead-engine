from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from leads.models import Lead
from .models import Campaign, OutreachEmail
from .serializers import CampaignSerializer, OutreachEmailSerializer
from .ai import generate_email
from .email_sender import send_email


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer

    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OutreachEmailViewSet(viewsets.ModelViewSet):
    serializer_class = OutreachEmailSerializer

    def get_queryset(self):
        qs = OutreachEmail.objects.filter(lead__user=self.request.user).select_related('lead', 'campaign')
        lead_id = self.request.query_params.get('lead_id')
        if lead_id:
            qs = qs.filter(lead_id=lead_id)
        return qs

    @action(detail=False, methods=['post'])
    def generate(self, request):
        lead_id = request.data.get('lead_id')
        goal = request.data.get('goal', 'connect and explore how we can help').strip()
        voice = request.data.get('voice', 'professional').strip()
        campaign_id = request.data.get('campaign_id')

        try:
            lead = Lead.objects.get(pk=lead_id, user=request.user)
        except Lead.DoesNotExist:
            return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)

        result = generate_email(lead, goal, voice)

        campaign = None
        if campaign_id:
            try:
                campaign = Campaign.objects.get(pk=campaign_id, user=request.user)
            except Campaign.DoesNotExist:
                pass

        email = OutreachEmail.objects.create(
            lead=lead,
            campaign=campaign,
            subject=result['subject'],
            body=result['body'],
        )
        return Response(OutreachEmailSerializer(email).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        email_obj = self.get_object()
        if not email_obj.lead.email:
            return Response({'error': 'Lead has no email address'}, status=status.HTTP_400_BAD_REQUEST)
        if email_obj.status == 'sent':
            return Response({'error': 'Email already sent'}, status=status.HTTP_400_BAD_REQUEST)

        success, error = send_email(
            to=email_obj.lead.email,
            subject=email_obj.subject,
            body=email_obj.body,
        )
        if not success:
            return Response({'error': error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        email_obj.status = 'sent'
        email_obj.sent_at = timezone.now()
        email_obj.save()

        email_obj.lead.status = 'contacted'
        email_obj.lead.save()

        return Response({'status': 'sent'})
