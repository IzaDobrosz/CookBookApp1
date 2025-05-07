from django import forms
from .models import RecipeStep

class RecipeStepForm(forms.ModelForm):
    step_number = forms.IntegerField(min_value=1, max_value=50, label='Step Number')
    instruction = forms.CharField(widget=forms.Textarea, label='Instruction')
    temperature = forms.IntegerField(min_value=1, max_value=300, required=False, label='Temperature')
    time = forms.DurationField(required=False, label='Time (minutes)')

    class Meta:
        model = RecipeStep
        fields = ['id', 'step_number', 'instruction', 'temperature', 'time']
