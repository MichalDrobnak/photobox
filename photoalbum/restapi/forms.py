from .models import User
from django.forms import ModelForm


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = [
            'date_of_birth',
            'first_name',
            'last_name',
            'username',
            'email',
            'password'
        ]
