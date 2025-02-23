from django.db import models
from django.contrib.auth.models import AbstractUser

__all__ = [
    'User',
    'Album',
    'Category',
    'Photo',
    'AlbumUser'
]


class User(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    date_of_birth = models.DateField()
    first_name = models.CharField(max_length=256, blank=False, null=False)
    last_name = models.CharField(max_length=256, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return self.get_full_name()


class Category(models.Model):
    slug = models.SlugField(primary_key=True)
    name = models.TextField(unique=True)

    @property
    def use_count(self):
        return self.photos.count() + self.albums.count()


class Album(models.Model):
    public = models.BooleanField(default=False)
    #slug = models.SlugField(unique=True)
    name = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE,
                              related_name="owned_albums")
    categories = models.ManyToManyField(Category, related_name="albums")


class AlbumUser(models.Model):
    class Permissions(models.IntegerChoices):
        none = 0b00
        read_only = 0b01
        write_only = 0b10
        read_write = 0b11
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="users")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="albums")
    liked = models.BooleanField(default=False)
    permissions = models.IntegerField(choices=Permissions.choices, default=Permissions.read_write)

    class Meta:
        unique_together = (('album', 'user'),)


class Photo(models.Model):
    caption = models.TextField()
    location = models.TextField()
    image = models.ImageField(upload_to='images')
    albums = models.ManyToManyField(Album, related_name="photos")
    likes = models.ManyToManyField(User, related_name="liked_photos")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_photos")
    categories = models.ManyToManyField(Category, related_name="photos")
