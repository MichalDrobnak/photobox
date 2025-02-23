#!/bin/sh
set -x
cd /var/django/repo/
if [ `whoami` = "uwsgi" ]
then
    git pull || echo 'django: msg git pull failed'
    pip3 install -r requirements.txt
    python3 manage.py collectstatic --noinput
    python3 manage.py makemigrations restapi
    python3 manage.py migrate
    exit 0
fi

chown -R uwsgi:uwsgi .
su -s "/bin/sh" -c "../run.sh" uwsgi
export PYTHONPATH="/home/uwsgi/.local/lib/python3.8/site-packages"
export PATH="/home/uwsgi/.local/bin:${PATH}"

ARGS="--thunder-lock --module $APP.wsgi --uid uwsgi --gid uwsgi"
ARGS="$ARGS --processes 10 --vacuum --master -T"
if [ "$ENV" = "local" ]
then
    ARGS="$ARGS --http-socket 0.0.0.0:80"
else
    if [ "$SOCK_TYPE" = "unix" ]
    then
        ARGS="$ARGS --socket /tmp/django/$APP.sock -C 666"
    else
        ARGS="$ARGS --socket 0.0.0.0:80"
    fi
fi

exec uwsgi $ARGS