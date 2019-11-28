from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _

from social_django.models import UserSocialAuth
from common.models import IndexedTimeStampedModel

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, IndexedTimeStampedModel):
    email = models.EmailField(max_length=255, unique=True)
    is_staff = models.BooleanField(
        default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))
    is_active = models.BooleanField(
        default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def __str__(self):
        return self.email

    def github_credentials(self):
        try:
            return self.social_auth.get(provider='github')
        except UserSocialAuth.DoesNotExist:
            return None

    def is_repository_owner(self, repository_name):
        credentials = self.github_credentials()
        if credentials is None:
            return False
        # Validates that the GitHub user owns the repository
        github_user = credentials.extra_data['login']
        if f'{github_user}/' not in repository_name:
            return False
        return True
