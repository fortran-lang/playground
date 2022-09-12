#!/bin/bash
#
# This script initializes the systemd services.
# This is useful to do when setting up the Fortran Playground background server
# on a new machine or VM for the first time.
# Run it as `sudo initialize-services.sh`.

for service in playground-server playground-reverse-proxy; do
  echo Copying $service.service to /etc/systemd/system/.
  cp $service.service /etc/systemd/system/.
  echo Starting and enabling service $service
  systemctl start $service
  systemctl enable $service
done
