#!/bin/bash

pip3 install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate

python3 manage.py runserver 127.0.0.1:8080
