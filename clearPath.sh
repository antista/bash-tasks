#!/bin/bash
 
if [ "$1" == "-h" ] || [ "$1" == "--help" ]
then
    echo "This program prints PATH without useless directories"
exit
fi

if [ -z "$1" ]
then
	path="$PATH"
else
	path="$1"
fi

cleanPath=""
IFS=":"
for dir in $path
do
    if [ -d "$dir" ]
	then
        for file in $(find "$dir" -maxdepth 1 | tr "\\n" ":")
		do
            if [ -f "$file" ]
			then
				if [ "$cleanPath" == "" ]; then
					cleanPath+="$dir"
				else
					cleanPath+=:"$dir"
				fi
				break
			fi
        done
    fi
done
echo "$cleanPath"
