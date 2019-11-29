from django.conf.urls import include, url  # noqa
from django.contrib.auth.views import logout_then_login

import django_js_reverse.views
from rest_framework.routers import DefaultRouter

from common.views import home, login
from users.views import auth_user_github_data
from commits.routes import routes as commits_routes

router = DefaultRouter()

routes = commits_routes
for route in routes:
    router.register(route['regex'], route['viewset'], basename=route['basename'])

urlpatterns = [
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),

    url(r'^oauth/', include('social_django.urls', namespace='social')),
    url(r'^api-auth/', include('rest_framework.urls')),

    url(r'^$', home, name='home'),
    url(r'^commits/$', home, name='commits'),
    url(r'^login/$', login, name='login'),
    url(r'^logout/$', logout_then_login, name='logout'),

    url(r'^api/', include(router.urls)),
    url(r'^api/github-data/$', auth_user_github_data, name='github-data'),
]
