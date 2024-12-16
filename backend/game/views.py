from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def game_progress(request):
    user_progress = request.user.progress
    return JsonResponse({'progress': user_progress})
