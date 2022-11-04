from django import forms
from .models import Ingredient, Recipe, Blackboard, KeyIngredient, Pasta
from django.forms import ModelForm
from django import forms

# This form will handle all of models:
# -Ingredient
# - Key Ingredient
# - Pasta
# because of their identical structure
class IngredientForm(forms.Form):
  type_choices = [
    ('Ingredient', 'Ingredient'),
    ('KeyIngredient', 'Key Ingredient'),
    ('Pasta','Pasta')
  ]
  type = forms.ChoiceField(choices = type_choices)
  name = forms.CharField(max_length=50)

class RecipeForm(ModelForm):
  class Meta:
    model = Recipe
    fields = '__all__'
    
class BlackboardForm(ModelForm):
  class Meta:
    model = Blackboard
    fields = '__all__'
    
    
