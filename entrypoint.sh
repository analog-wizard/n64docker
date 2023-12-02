#!/bin/bash
set -ex

rm -rf /run/dbus/pid
mkdir -p /var/run/dbus
dbus-uuidgen > /var/lib/dbus/machine-id
/bin/sh -c "dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address"

#dbus-daemon returns before it returns the sock obj
sleep 2

mkdir -p /run/pulse/.config
chown -R pulse /run/pulse

exec supervisord -c /app/supervisord.conf