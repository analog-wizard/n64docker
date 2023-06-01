#One of 2 Composite Docker Container from the 3 seperate
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
        novnc \
        x11vnc \
        fluxbox \
        net-tools \
        supervisor \
        mupen64plus-qt

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

COPY ./main /app
CMD ["/app/entrypoint.sh"]
EXPOSE 8080
