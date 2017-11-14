if [ "$1" == "-h" -o "$1" == "--help" ]
  then
    echo The program copies the .jpg files to a new folder and adds a signature in the lower right corner
    echo Argument1: sourcedir
    echo Argument2: adding word
    echo argument3: targetdir
elif [ -z "$3" ]
  then
   echo Error, need 3 arguments
else
  rm -fr $3
  cp -r $1 $3
  cd $3
  for var in *\.jpg
  do
    name="${var%%.*}"
    suffix="_annotated.jpg"
    convert $var -font courier -fill white -pointsize 20 -gravity southeast -annotate 0 $2 $var
    mv $var $name$suffix
  done
  cd ..
fi
