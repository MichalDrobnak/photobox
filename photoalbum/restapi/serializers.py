from dynamic_rest.serializers import DynamicModelSerializer, DynamicRelationField
from dynamic_rest.fields import DynamicMethodField
from .models import *


class AlbumSerializer(DynamicModelSerializer):
    class Meta:
        model = Album
        name = "results"
        fields = ['id', 'public', 'name', 'created_at', 'updated_at', 'owner', 'categories']
    owner = DynamicRelationField('UserSerializer')
    categories = DynamicRelationField('CategorySerializer', many=True)


class PhotoSerializer(DynamicModelSerializer):
    class Meta:
        model = Photo
        name = "results"
        fields = ['id', 'image', 'caption', 'albums', 'categories', 'owner', 'liked']
    albums = DynamicRelationField('AlbumSerializer', many=True)
    categories = DynamicRelationField('CategorySerializer', many=True)
    liked = DynamicMethodField(
        requires=[
            'likes'
        ])

    def get_liked(self, photo):
        return photo.likes.filter(id=self.context["request"].user.id).exists()


class AlbumUserSerialize(DynamicModelSerializer):
    class Meta:
        model = AlbumUser
        name = "results"
        fields = ['id', 'liked', 'permissions', 'album', 'user']
    album = DynamicRelationField(AlbumSerializer, embed=True)
    user = DynamicRelationField('UserSerializer')


class UserSerializer(DynamicModelSerializer):
    class Meta:
        model = User
        name = "results"
        fields = ['id', 'username', 'email', 'date_of_birth', 'full_name', 'created_at', 'password', 'last_name', 'first_name']
        extra_kwargs = {
            'password': {
                'write_only': True,
            },
            'first_name': {
                'write_only': True,
            },
            'last_name': {
                'write_only': True,
            }
        }


class RegisterSerializer(DynamicModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'date_of_birth', 'first_name', 'last_name', 'password']


class CategorySerializer(DynamicModelSerializer):
    class Meta:
        model = Category
        name = "results"
        fields = ['slug', 'name', 'use_count', 'photos', 'albums']
    photos = DynamicRelationField(PhotoSerializer, many=True)
    albums = DynamicRelationField(AlbumSerializer, many=True)
