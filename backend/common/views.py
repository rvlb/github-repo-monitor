from django.contrib.auth.decorators import login_required, user_passes_test

from django.shortcuts import render


@login_required
def home(request):
    return render(request, 'main.html')


# The user should only see the login screen if not authenticated
@user_passes_test(lambda u: not u.is_authenticated, '/', redirect_field_name=None)
def login(request):
    return render(request, 'login.html')
