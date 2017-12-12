#!/bin/bash

if [ "$1" == "-h" ] || [ "$1" == "--help" ]
then 
	echo "The program displays a list of unique ip with levels ERROR or FATAL from given Argument1 file"
elif [ -z "$1" ]
then
	echo "Error, need an argument with file's name"
elif [ ! -f "$1" ]
then
	echo "This file does not exists"
else
	cat $1 | grep -E '\<(ERROR|FATAL)' | cut -d\| -f3 | cut -c 2-16 | sort -u
fi 