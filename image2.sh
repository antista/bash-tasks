#!/bin/bash

if [ "$1" == "-h" ] || [ "$1" == "--help" ]
then
	echo "The program adds a given signature to the lower right corner for all .jpg files in given directory"
	echo "Argument 1: the directory of inital .jpg files"
	echo "Argument 2: the signature's text"
	echo "Argument 3: a directory for annotated files"
	echo "[Argument 4]: font's name"
	echo "[Argument 5]: font's size"
elif [ -z "$3" ]
then
	echo "Error, need 3 arguments"
	exit
else
	if [ -z "$4" ]; then 
		font=courier
	else 
	font="$4"
	fi
	if [ -z "$5" ]; then
		fontsize=30
	else
		fontsize="$5"
	fi
	if [ ! -d "$3" ]; then
		outDir="$3"
	else
		s=1
		while [ -d "$3_""$s" ]; do
			let "s+=1"
		done
		outDir="$3_$s"
	fi
cp -R "$1" "$outDir"
cd "$outDir" || exit
for pic in *\.jpg 
do
	name="${pic%%.*}"
	suf="_annotated.jpg"
	convert "$pic" -fill yellow -font "$font" -pointsize "$fontsize" -gravity southeast  -annotate 0 "$2" "$name$suf"
	rm "$pic" 
done
cd ..
fi 
