from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
class UserAdmin(BaseUserAdmin):
  fieldsets = BaseUserAdmin.fieldsets + (
    (None, {'fields': ('type',)}),
  )
  add_fieldsets = BaseUserAdmin.add_fieldsets + (
    (None, {'fields': ('type',)}),
  )
  
admin.site.register(Blackboard)
admin.site.register(User, UserAdmin)
admin.site.register(Recipe)
admin.site.register(KeyIngredient)
admin.site.register(Ingredient)
admin.site.register(Pasta)
