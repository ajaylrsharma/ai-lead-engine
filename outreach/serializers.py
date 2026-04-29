from rest_framework import serializers
from .models import Campaign, OutreachEmail


class OutreachEmailSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    lead_company = serializers.CharField(source='lead.company', read_only=True)

    class Meta:
        model = OutreachEmail
        fields = '__all__'
        read_only_fields = ['created_at', 'sent_at']


class CampaignSerializer(serializers.ModelSerializer):
    email_count = serializers.SerializerMethodField()
    sent_count = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_email_count(self, obj):
        return obj.emails.count()

    def get_sent_count(self, obj):
        return obj.emails.filter(status='sent').count()
