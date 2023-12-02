FROM ubuntu:latest
ARG DEBIAN_FRONTEND=noninteractive

LABEL Description="Lightweight container with Nginx 1.22 & PHP 8.1 based on Ubuntu Linux."

# Setup document root
WORKDIR /var/www/html

RUN apt-get update && \ 
    apt-get install -y \
        bash \
        dbus \
        dbus-x11 \
        ruby \
        sudo \
        xvfb \
        x11vnc \
        ffmpeg \
        fluxbox \
        net-tools \
        pulseaudio \
        websockify \
        mupen64plus-qt && \
    apt-get install -y \
        python3-websockets \
        python3-pip \
        curl \
        nginx \
        php \
        php-ctype \
        php-curl \
        php-dom \
        php-fpm \
        php-gd \
        php-intl \
        php-mbstring \
        php-mysqli \
        php-opcache \
        php-phar \
        php-xml \
        php-xmlreader \
        supervisor

RUN pip install evdev

# configure mupen to relay audio and if possible make properly full screen
COPY ./config/mupen/mupen64plus.cfg     /config/mupen64plus/mupen64plus.cfg

RUN mkdir /run/php
COPY ./config/php/fpm-pool.conf         /etc/php/php-fpm.d/www.conf
COPY ./config/php/php.ini               /etc/php/conf.d/custom.ini

# Configure nginx - http
COPY ./config/nginx/nginx.conf          /etc/nginx/nginx.conf
COPY ./config/nginx/default-nginx.conf  /etc/nginx/conf.d/default.conf

COPY ./games /games

# Setup demo environment variables
ENV HOME=/root \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8 \
    LC_ALL=C.UTF-8 \
    DISPLAY=:0.0 \
    DISPLAY_WIDTH=1024 \
    DISPLAY_HEIGHT=768

# Copy noVNC libraries and sites to the nginx host directory
COPY ./src/ /var/www/html
RUN chown www-data /var/www/html

# Set ownership of the website file to "www-data", the user that runs the server
# RUN chown -R www-data /var/www/html

RUN adduser root pulse-access

COPY ./config/supervisord/. /app/conf.d/.
COPY ./entrypoint.sh /app
COPY ./config/supervisord.conf /app/supervisord.conf

CMD ["/app/entrypoint.sh"]
EXPOSE 8080
