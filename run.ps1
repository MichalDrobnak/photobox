Get-Content requirements.txt | Select-String -pattern "uwsgi" -notmatch | sort |Out-File -FilePath "requirements(Windows).txt"
py -m pip install -r "requirements(Windows).txt"
py manage.py makemigrations
py manage.py migrate

py manage.py runserver 127.0.0.1:8080