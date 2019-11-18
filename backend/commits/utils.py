def get_user_credentials(user):
    if (user is None):
        return None
    return user.social_auth.get(provider='github')