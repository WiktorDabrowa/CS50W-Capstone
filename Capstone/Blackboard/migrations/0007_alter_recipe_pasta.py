# Generated by Django 4.0.5 on 2022-10-22 16:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Blackboard', '0006_alter_recipe_pasta'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='pasta',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='Blackboard.pasta'),
        ),
    ]
