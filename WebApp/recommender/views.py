from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
import os
from . import api_helper_functions as helper
import requests
from django.http import JsonResponse

def upload_video(request):
    if request.method == 'POST' and request.FILES['video']:
        video = request.FILES['video']
        video_name = video.name.replace(" ", "_")
        random_string = helper.generate_random_string()
        base_name, ext = os.path.splitext(video_name)
        video_name = f"{base_name}_{random_string}{ext}"
        presignedUrl = helper.getpresignedURL(video_name)

        fs = FileSystemStorage()
        filename = fs.save(video_name, video)

        try:
            response = requests.put(presignedUrl, data=video)
            response.raise_for_status()  # Raises stored HTTPError, if one occurred.
            print(f"Upload Successful: {response.status_code}")
            job_id  = helper.getRecommendation(video_name)
            print(job_id)
            return render(request, 'upload.html', {'video_url': filename, "Job_id" : job_id})
        except requests.exceptions.RequestException as e:
            print(f"Upload Failed: {e}")


    return render(request, 'upload.html')


def check_recommendation_status(request):
    if request.method == 'POST':
        job_id = request.POST.get('job_id')
        print(job_id)
        labels_status = helper.check_recommendation_status(job_id)
        print(labels_status)
        if labels_status and labels_status['status'] == 'SUCCEEDED':
            labels = labels_status['body']
            recommendations = helper.getRecommendation_gemini(labels)
            return JsonResponse({'status': 'completed', 'recommendations': recommendations})
        elif labels_status and labels_status['status'] == 'RUNNING':
            return JsonResponse({'status': 'RUNNING'})
        else:
            return JsonResponse({'status': 'error', 'error': 'Failed to check job status'})
