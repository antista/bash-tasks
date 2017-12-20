#!/bin/bash
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then 
	echo "The program finds and prints all first-level subdirectories in given directory in which no files are open"
exit
fi
 
if [ "$1" == "-d" ] || [ "$1" == "--directory" ]; then
	if [ ! -d "$2" ]
	then
		echo "This directory does not exist"
		exit
	fi
	path="$2"
else
	path="$(pwd)"
fi
 
dirs=$(lsof +D "$path" | cut -f9)
for dir in "$path"/*
do
	if [[ $(echo "$dirs" | grep -c "$dir") -eq 0 ]] && [ -d "$dir" ]; then
		echo "$dir"
	fi
done
