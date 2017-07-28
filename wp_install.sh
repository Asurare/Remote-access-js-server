#!/bin/bash
# name domain email title password
url=$2
user=$1
pass=$5
title=$4
email=$3
#path="/var/www/vhosts/"
#path+=$2
#if [ ! -d "$path" ]; then
#  echo "This directory doesn't exist !"
#  exit
#fi
mkdir wordpress
cd wordpress
#download wordpress
wp core download --locale=fr_FR --force
wp core version
wp core config --dbname=$1 --dbuser=root --dbpass=root --skip-check --extra-php <<PHP
define( 'WP_DEBUG', true );
PHP
wp db create
# install
wp core install --url=$url --title="$title" --admin_user=$user --admin_email=$email --admin_password=$pass core download --locale=fr_FR --force
wp core version
