from django.db import models
from django.contrib.auth.models import User


class Lead(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('replied', 'Replied'),
        ('converted', 'Converted'),
        ('lost', 'Lost'),
    ]
    SOURCE_CHOICES = [
        ('google_maps', 'Google Maps'),
        ('linkedin', 'LinkedIn'),
        ('yelp', 'Yelp'),
        ('csv', 'CSV Import'),
        ('manual', 'Manual'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leads')
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(max_length=500, blank=True)
    address = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='manual')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='new')
    score = models.IntegerField(null=True, blank=True)
    score_reasoning = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.company}"
