from dataclasses import asdict
from datetime import datetime
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
from .models import *
from .forms import *

# Create your views here.

def index(request):
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

@login_required(login_url = '/login')
def staff(request):
  pastas = Pasta.objects.all()
  ingredient_form = IngredientForm()
  pasta_form = PastaForm()
  key_ingredient_form = KeyIngredientForm()
  recipe_form = RecipeForm()
  blackboard_form = BlackboardForm()
  user = request.user
  context = {
    'pastas':pastas,
    'user_type': user.type,
    'ingredient_form': ingredient_form,
    'pasta_form':pasta_form,
    'key_ingredient_form':key_ingredient_form,
    'recipe_form':recipe_form,
    'blackboard_form':blackboard_form
  }
  return render(request, 'Blackboard/staff.html',context)


# API View
def get_items(requst, db_item):
  if requst.method == 'GET':
    if db_item == 'recipes':
      query = Recipe.objects.all()
      return JsonResponse(serializers.serialize('json', query, use_natural_foreign_keys=True, indent=2), safe=False)
    elif db_item == 'ingredients':
      ingredients = list(Ingredient.objects.all())
      key_ing = list(KeyIngredient.objects.all())
      pastas = list(Pasta.objects.all())
      query = [*ingredients, *key_ing, * pastas]
      return JsonResponse(serializers.serialize('json', query, use_natural_foreign_keys=True, indent=2), safe=False)
    elif db_item == 'blackboards':
      query = Blackboard.objects.all()
      return JsonResponse(serializers.serialize('json', query, use_natural_foreign_keys = True, indent = 2), safe = False)
  