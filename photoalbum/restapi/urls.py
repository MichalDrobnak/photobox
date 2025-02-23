from django.urls import path, include
from dynamic_rest.routers import DynamicRouter
from rest_framework_swagger.views import get_swagger_view
from django.conf import settings
from django.conf.urls.static import static

from .views import *


router = DynamicRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'album', AlbumViewSet)
router.register(r'photo', PhotoViewSet)
router.register(r'albumuser', AlbumUserViewSet)
schema_view = get_swagger_view(title='Photoalbum API')
urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login),
    path('auth/logout/', logout),
    path('auth/register/', register),
    path("doc", schema_view),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
