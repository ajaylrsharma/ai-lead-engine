from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, OutreachEmailViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'emails', OutreachEmailViewSet, basename='email')

urlpatterns = [path('', include(router.urls))]
