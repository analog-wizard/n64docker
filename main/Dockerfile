# One of 2 Composite Docker images from the 3 seperate
# This image will serve as the emulator, containing the emulator and a minimal xvnc setup
FROM ubuntu:latest
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \ 
    apt-get install -y \
        gcc \
        git \
        bash \
        make \
        ruby \
        xvfb \
        nginx \
        novnc \
        x11vnc \
        fluxbox \
        net-tools \
        supervisor \
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

# inject extra webpage that assigns a player a virtual controller and for a "spectator" mode
# "spectator" mode is just a modified vnc_lite.html that doesnt take inputs
# and remove "vnc_lite.html" because it has been replaced with "spectator.html"
RUN rm -f /usr/share/novnc/vnc_lite.html
COPY ./util/player.html ./util/spectator.html ./util/xmlhands.php /usr/share/novnc/

COPY ./util/nginx.conf /etc/nginx/nginx.conf

# "./main" because the context for the docker compose file is the directory above this one
COPY ./main /app
CMD ["/app/entrypoint.sh"]
EXPOSE 8080
