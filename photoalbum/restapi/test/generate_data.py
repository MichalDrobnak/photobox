import requests
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
import photoalbum.restapi.models as models
import yaml
import logging
from collections import OrderedDict
from django.core.files import File
from ..models import Photo, User


def ordered_load(stream, Loader=yaml.SafeLoader, object_pairs_hook=OrderedDict):
    class OrderedLoader(Loader):
        pass

    def construct_mapping(loader, node):
        loader.flatten_mapping(node)
        return object_pairs_hook(loader.construct_pairs(node))
    OrderedLoader.add_constructor(
        yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
        construct_mapping)
    return yaml.load(stream, OrderedLoader)


_G = getattr


logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger('test')


def clear_model(model):
    logger.warn(f"Clearing model {model.__name__}")
    model.objects.all().delete()


def clear_apps(*modules):
    for module in modules:
        for model in module.__all__:
            clear_model(model)


def load(fname):
    logger.debug(f"Loading {fname}")
    with open(fname, 'r') as source:
        return yaml.load(source, Loader=yaml.SafeLoader)


def exist(model, kwargs, i=None):
    attrs, rel = {}, {}
    for k, v in kwargs.items():
        if type(v) == dict or type(v) == list:
            rel[k] = v
        else:
            attrs[k] = v
    logger.debug(f"Creating {model.__name__} {attrs}")
    # obj = model.objects.filter(**attrs)
    # if len(obj) > 0:
    #     obj = obj[0]
    # else:
    password = None
    if 'password' in attrs:
        password = attrs['password']
        del attrs["password"]
    obj = model(**attrs)
    if password:
        obj.set_password(password)

    for k, v in rel.items():
        if type(v) != list:
            logger.debug(f"Setting {obj}.{k} = {v}")
            rel_i = _G(model, k).get_queryset().get(**v)
            setattr(obj, k, rel_i)

    obj.save()
    for k, v in rel.items():
        if type(v) == list:
            for item in v:
                logger.debug(f"Adding {obj}.{k} + {item}")
                rel_i = _G(model, k).rel.field.related_model.objects.get(**item)
                _G(obj, k).add(rel_i)
    logger.info(f"Created {obj}")


def exist_objects(model, *args):
    i = 0
    for object in args:
        i += 1
        exist(model, object, i)


def set_db(models, data):
    model_map = {model.__name__.lower(): model for model in models}
    for model, items in data.items():
        logger.debug(f'Checking {model}')
        if model in model_map:
            model = model_map[model]
            clear_model(model)
            exist_objects(model, *items)


def iterate_models(module):
    for model in module.__all__:
        yield getattr(module, model)


def save_image():
    """Saves just one image as it would take me longer than necessary to figure out a better way.
    """
    r = requests.get(r"https://upload.wikimedia.org/wikipedia/commons/3/34/Alfa-Romeo_Alfa_6_2.0_%281984%29_%2849034481178%29.jpg")

    img_temp = NamedTemporaryFile()
    img_temp.write(r.content)
    img_temp.flush()

    owner = User.objects.get(id=1)

    photo = Photo.objects.create(
        caption="Alfa 6",
        location="Turin, Italy",
        owner=owner
    )
    photo.image.save("alfa6.jpg", File(img_temp), save=True)
    photo.albums.set([1])
    photo.likes.set([1])


set_db(list(iterate_models(models)), load("photoalbum/restapi/test/test_data.yml"))
save_image()
