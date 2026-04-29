from django.contrib import admin
from django.urls import path, include
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    from leads.models import Lead
    from outreach.models import OutreachEmail

    user = request.user
    week_ago = timezone.now() - timedelta(days=7)
    leads = Lead.objects.filter(user=user)

    return Response({
        'total_leads': leads.count(),
        'new_this_week': leads.filter(created_at__gte=week_ago).count(),
        'contacted': leads.filter(status='contacted').count(),
        'replied': leads.filter(status='replied').count(),
        'converted': leads.filter(status='converted').count(),
        'emails_sent': OutreachEmail.objects.filter(lead__user=user, status='sent').count(),
        'by_status': list(leads.values('status').annotate(count=Count('id'))),
        'by_source': list(leads.values('source').annotate(count=Count('id'))),
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/leads/', include('leads.urls')),
    path('api/outreach/', include('outreach.urls')),
    path('api/dashboard/stats/', dashboard_stats, name='dashboard_stats'),
]
