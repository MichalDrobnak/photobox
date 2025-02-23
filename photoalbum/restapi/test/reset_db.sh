#!/bin/bash

rm *.sqlite3
find . -name "migrations" -exec rm -r {} \; 2>/dev/null
python3 manage.py makemigrations restapi
python3 manage.py makemigrations 
python3 manage.py migrate
python3 manage.py shell -c "import photoalbum.restapi.test.generate_data"