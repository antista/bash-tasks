#!/bin/bash

if [ "$1" == "-h" ] || [ "$1" == "--help" ]
then 
	echo "The program leads all units of measurement from the configuration file to a single dimension"
elif [ -z "$1" ]
then
	echo "Error, need an argument with file's name"
elif [ ! -f "$1" ]
then
	echo "This file does not exist"
else 
	cat "$1" | grep '=' | awk -F= '{switch ($2) {
					case  /^[0-9]+s$/ : print $1"="$2*1;
					break;
					case /^[0-9]+min$/ : print $1"="$2*60;
					break; 
					case /^[0-9]+h$/ : print $1"="$2*3600;
					break;
					case /^[0-9]+d$/ : print $1"="$2*3600*24;
					break;
					case /^[0-9]+mm$/ : print $1"="$2/1000;
					break;
					case /^[0-9]+sm$/ : print $1"="$2/100;
					break;
					case /^[0-9]+dm$/ : print $1"="$2/10;
					break;
					case /^[0-9]+m$/ : print $1"="$2*1;
					break;
					case /^[0-9]+km$/ : print $1"="$2*1000;
					break;
					case /^[0-9]+mg$/ : print $1"="$2/1000000;
					break;
					case /^[0-9]+g$/ : print $1"="$2/1000;
					break;
					case /^[0-9]+kg$/ : print $1"="$2*1;
					break;
					case /^[0-9]+t$/ : print $1"="$2*1000;
					break; }
				}'
fi 
