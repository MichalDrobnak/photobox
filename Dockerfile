FROM python:3.8-alpine3.14

RUN apk update
RUN apk add git

RUN addgroup -S uwsgi && adduser -S uwsgi -G uwsgi

RUN apk add --virtual .build-deps python3-dev build-base linux-headers gcc pcre-dev freetype-dev postgresql-dev musl-dev

RUN mkdir -p /tmp/django/
RUN chown uwsgi:uwsgi /tmp/django
RUN chmod 755 /tmp/django

EXPOSE 80

RUN mkdir -p /tmp/django/
RUN chown uwsgi:uwsgi /tmp/django
RUN chmod 755 /tmp/django


WORKDIR /var/django
COPY ./setup.sh ./run.sh
RUN chown uwsgi:uwsgi /var/django/run.sh
RUN chmod 755 /var/django/run.sh



ENTRYPOINT ["./run.sh"]