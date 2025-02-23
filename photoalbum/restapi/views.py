#from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import permissions

from dynamic_rest.viewsets import DynamicModelViewSet
from rest_framework_swagger.views import get_swagger_view
import django.contrib.auth as auth
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password

from .models import User, Category
from .serializers import *
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser

class IsSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user


schema_view = get_swagger_view(title='Photoalbum API')


class UserViewSet(DynamicModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ('update', 'partial_update', 'destroy'):
            permission_classes = [IsSelf, permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["GET"],)
    def profile(self, request):
        """Returns current user profile"""
        return Response(self.serializer_class(request.user).data)

    def create(self, request, *args, **kwargs):
        pass


class CategoryViewSet(DynamicModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class AlbumUserViewSet(DynamicModelViewSet):
    serializer_class = AlbumUserSerialize
    queryset = AlbumUser.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user.id)


def create_missing_categories(categories):
    existing_categories = Category.objects.filter(name__in=categories)
    existing_categories = set(category.name for category in existing_categories)
    not_in_db = set(categories) - set(existing_categories)
    for category in not_in_db:
        new_category = Category.objects.create(slug=category, name=category)
        new_category.save()


class PhotoViewSet(DynamicModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    parser_classes = [FormParser, MultiPartParser]
    @action(
        detail=True, methods=["POST"], 
        parser_classes=[JSONParser])
    def like(self, request, pk):
        photo = self.queryset.get(pk=pk)
        photo.likes.add(request.user)
        photo.save()
        return Response({"status": "success"})
    @action(
        detail=True, methods=["POST"], 
        parser_classes=[JSONParser])
    def unlike(self, request, pk):
        photo = self.queryset.get(pk=pk)
        photo.likes.remove(request.user)
        photo.save()
        return Response({"status": "success"})
    def create(self, request):
        request_category_slugs = eval(request.data["categories"])
        create_missing_categories(request_category_slugs)

        request.data["categories"] = request_category_slugs
        request.data["albums"] = eval(request.data["albums"])
        request.data["owner"] = request.user.id
        photo = PhotoSerializer(data=request.data)

        if not photo.is_valid():
            return Response({'status': 'failed',
                             'errors': photo.errors},
                            status=400
                            )
        photo.save()

        return Response({'status': 'success'})


class AlbumViewSet(DynamicModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    def create(self, request):
        create_missing_categories(request.data["categories"])
        request.data["owner"] = request.user.id
        album = AlbumSerializer(data=request.data)

        if not album.is_valid():
            return Response({'status': 'failed',
                             'errors': album.errors},
                            status=400
                            )
        album = album.save()

        albumUser = AlbumUser.objects.create(album=album,
                                             user=request.user,
                                             permissions=AlbumUser.Permissions.read_write)
        albumUser.save()

        return Response({'status': 'success'})


@api_view(['POST'])
@permission_classes([~permissions.IsAuthenticated])
def register(request):
    """
    API endpoint for registration form
        Fields:
            date_of_birth
            first_name
            last_name
            username
            email
            password
    """
    if request.data.get('date_of_birth'):
        # mountain comes to Mohamed
        request.data['date_of_birth'] = request.data['date_of_birth'].split('T')[0]
    u = RegisterSerializer(data=request.data)
    if not u.is_valid():
        return Response({'status': 'failed', 'errors': u.errors}, status=400)
    user = u.save()
    user.set_password(request.data['password'])
    user.save()
    return Response({'status': 'success'})


@api_view(['POST'])
@permission_classes([~permissions.IsAuthenticated])
def login(request):
    """Login endpoint"""
    u = User.objects.filter(email=request.data.get('email'))
    if len(u) != 1 or not check_password(request.data['password'], u[0].password):
        return Response({'status': 'failed'}, status=403)
    auth.login(request, u[0])
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """Logout endpoint"""
    auth.logout(request)
    return Response({'status': 'success'})
