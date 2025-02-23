Remove-Item *.sqlite3
Remove-Item .\photoalbum\restapi\migrations -r
py manage.py makemigrations restapi
py manage.py makemigrations
py manage.py migrate
py manage.py shell -c "import photoalbum.restapi.test.generate_data"