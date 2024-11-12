from django import forms
from .models import RecipeStep

class RecipeStepForm(forms.ModelForm):
    step_number = forms.IntegerField(min_value=1, max_value=50, label='Step Number')
    instruction = forms.CharField(widget=forms.Textarea, label='Instruction')
    temperature = forms.IntegerField(min_value=1, max_value=300, required=False, label='Temperature')
    time = forms.IntegerField(required=False, label='Time (minutes)')

    class Meta:
        model = RecipeStep
        fields = ['step_number', 'instruction', 'temperature', 'time']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Fill in JSON data from 'step_details' if exists
        if self.instance and self.instance.step_details:
            step_details = self.instance.step_details[0]
            self.fields['step_number'].initial = step_details.get('step_number')
            self.fields['instruction'].initial = step_details.get('instruction')
            self.fields['temperature'].initial = step_details.get('temperature')
            self.fields['time'].initial = step_details.get('time')



    def clean(self):
        # Create JSON from field values and assign them to 'step_details'
        cleaned_data = super().clean()
        step_details =[{
            'step_number': cleaned_data.get('step_number'),
            'instruction': cleaned_data.get('instruction'),
            'temperature': cleaned_data.get('temperature'),
            'time': cleaned_data.get('time'),
        }]
        self.instance.step_details = step_details
        return cleaned_data