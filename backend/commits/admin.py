from django.contrib import admin

from .models import Commit, Repository

admin.site.register(Repository)
admin.site.register(Commit)
