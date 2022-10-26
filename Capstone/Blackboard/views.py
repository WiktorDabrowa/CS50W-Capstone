from datetime import datetime
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse


from .models import Blackboard

# Create your views here.

def index(request):
  # Login Option for Staff
  # Blackboard for visitors
  blackboards = Blackboard.objects.all()
  blackboard = list(blackboards[0].recipes.all())
  starters = []
  mains = []
  desserts = []
  for recipe in blackboard:
    if recipe.type == 'Starter':
      starters.append(recipe)
    elif recipe.type == 'Main':
      mains.append(recipe)
    elif recipe.type == 'Dessert':
      desserts.append(recipe)
  blackboard = [*starters, *mains, *desserts]
  context = {
   'blackboard': blackboard
  }
  return render(request, 'Blackboard/index.html', context)

def login_view(request):
  if request.method == 'POST':
    # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("staff"))
        else:
            return render(request, "Blackboard/login.html", {
                "message": "Invalid username and/or password."
            })
  else:
    return render(request,'Blackboard/login.html')

def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse("index"))

#@login_required
def staff(request):
  
  user = request.user
  
  context = {
    'user_type': user.type
  }
  return render(request, 'Blackboard/staff.html',context)
