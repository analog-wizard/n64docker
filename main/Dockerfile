FROM analogwizard/docker-php-nginx:latest
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \ 
    apt-get install -y \
        bash \
        ruby \
        xvfb \
        x11vnc \
        fluxbox \
        net-tools \
        websockify \
        mupen64plus-qt

# configure mupen to relay audio and if possible make properly full screen
COPY ../config/mupen64plus.cfg /config/mupen64plus/mupen64plus.cfg
COPY ../games /games

# Setup demo environment variables
ENV HOME=/root \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8 \
    LC_ALL=C.UTF-8 \
    DISPLAY=:0.0 \
    DISPLAY_WIDTH=1024 \
    DISPLAY_HEIGHT=768

# add authentication to this main image to allow for debug should problems arise.
# simple vnc password (E.G. spectator)
RUN mkdir ~/.vnc
RUN x11vnc -storepasswd spectator ~/.vnc/passwd

# Copy noVNC libraries and sites to the nginx host directory
COPY noVNC-1.40-modified/ /var/www/html

# Set ownership of the website file to "www-data", the user that runs the server
RUN chown -R www-data /var/www/html

# "./main" because the context for the docker compose file is the directory above this one
COPY ./main /app

# Configure nginx - http
COPY ./config/nginx.conf /etc/nginx/nginx.conf
# Configure nginx - default server
# and overwrite the base image config to allow for websocket proxying
COPY ./config/default-nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/app/entrypoint.sh"]
EXPOSE 8080
