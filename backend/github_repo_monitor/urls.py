from django.conf.urls import include, url  # noqa
from django.contrib import admin

import django_js_reverse.views
from rest_framework.routers import DefaultRouter

from common.views import home, login
from users.routes import routes as users_routes

router = DefaultRouter()

routes = users_routes
for route in routes:
    router.register(route[0], route[1])

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),

    url(r'^oauth/', include('social_django.urls', namespace='social')),
    url(r'^api-auth/', include('rest_framework.urls')),

    url(r'^$', home, name='home'),
    url(r'^login/$', login, name='login'),

    url(r'^api/', include(router.urls)),
]
