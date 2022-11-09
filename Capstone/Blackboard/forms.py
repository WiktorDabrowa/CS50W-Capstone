from django import forms
from .models import Ingredient, Recipe, Blackboard, KeyIngredient, Pasta
from django.forms import ModelForm
from django import forms

# This form will handle all of models:
# - Ingredient
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

# Recipe form with changed widgets for 
# field related to another models
class RecipeForm(ModelForm):
  pasta = forms.ModelChoiceField(
    queryset = Pasta.objects.all(),
    widget = forms.RadioSelect,
    blank = True
  )
  
  key_ingredients = forms.ModelMultipleChoiceField(
        queryset = KeyIngredient.objects.all(),
        widget = forms.CheckboxSelectMultiple,
        blank = False
  ) 
  ingredients = forms.ModelMultipleChoiceField(
        queryset = Ingredient.objects.all(),
        widget = forms.CheckboxSelectMultiple,
        blank = False
    )
  class Meta:
    model = Recipe
    fields = '__all__'
    
    field_order = ['name','season','type','key_ingredients','ingredients','pasta','price']
    
    
class BlackboardForm(ModelForm):
  class Meta:
    model = Blackboard
    fields = '__all__'
    
    
