from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('', views.upload_video, name='upload_video'),
    path('check_recommendation_status/', views.check_recommendation_status, name='check_recommendation_status'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
