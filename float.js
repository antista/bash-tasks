function FloatNumber(sign, order, mantiss) {
	this.sign = sign;
	this.order = order;
	this.mantiss = mantiss;
}
function CreateFile(result) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var tf = fso.CreateTextFile("out.txt", true);
  tf.Write (result);
  tf.Close();
} 
function ReadFile(file) {
var fso = new ActiveXObject("Scripting.FileSystemObject");
var fh  = fso.OpenTextFile(file);
var str = fh.ReadAll();
fh.Close();
return str;
}

function toBin(n) { //Функция, переводящая число в двоичное
	var count = 0;
	var binN = new Array();
	if (n >=1) { //Перевод для целой части
		while (n>1 && count < 127) {
			binN.push(n%2);
			n = (Math.floor(n/2));
			count++;
		}
		binN.push(1);
		return binN.reverse();
	}
	else if (n==0) //Если число равно 0 (его дробная или целая часть)
		binN.push(0);
	else  //Перевод для дробной части
		while (n!=0 && count < 149) {
			binN.push(Math.floor((n*20)/10));
			n =((n*20)%10)/10;
			count++;
		}
	return binN;
}

function MakeFrPart(str) {
	var nFr = str.split(".")[1].split("");
	nFr.unshift(".");
	nFr.unshift("0"); //Чтобы число имело дробный вид
	nFr = nFr.join("");
	return toBin(nFr);
}

function MakeOrder (order) {
	order+=127;
	order = order.toString(2);
	if (order.length < 8) {
		var orderA = order.split("");
		while(orderA.length < 8)
			orderA.unshift("0");
		order = orderA.join("");
	}
	return order;
}

function ConvertToFloat(str) {
	var sign = 0;
	var order = 0;
	var mantiss = 0;
	
	var binNInt=new Array();
	var binNFr=new Array();
	
	if (isNaN(str)) //Если не число
		return new FloatNumber(0, 11111111, "10000000000000000000000");
	if (str > (2-Math.pow(2,-23))*Math.pow(2, 127)) //Если больше макс числа
		return new FloatNumber(0, 11111111, "00000000000000000000000");
	
	var nInt = str.split(".")[0].split(""); //Выделение целой части
	if (nInt[0] == "-") { //Если число отрицательное
		sign = 1;
		nInt.shift();
	}
	nInt = nInt.join("");
	
	if (str == "0" || str == "-0") //-0 и +0
		return new FloatNumber(sign, "00000000", "00000000000000000000000");
	else if (Number(S) < Math.pow(2, -126)) { //Денормализованные числа
		order = MakeOrder(-127);
		binNFr = MakeFrPart(str);
		binNFr.shift();
		binNFr.shift();
		WSH.echo("Denormal");
		return new FloatNumber(sign, order, binNFr.join("").substring(124));
	}
	binNInt = toBin(nInt); //Перевод в двоичное целой части числа
	
	if (str.indexOf(".")!= -1) //Если число дробное
		binNFr = MakeFrPart(str);
	
	if (binNInt.join("") > 0) //Приведение к научной нотации
		while (binNInt.length*binNInt[0] != 1) {
			binNFr.unshift(binNInt.pop());
			order++;
		}
	else {
		while (binNInt.length*binNInt[0] != 1) {
			binNInt[0] = binNFr.shift();
			order--;
		}
	}
	order = MakeOrder(order);

	mantiss = binNFr.join("").substr(0,23);
	while(mantiss.length < 23) 
		mantiss +="0"; 
	return new FloatNumber(sign, order, mantiss);
}

function Prepare (num) {
	var fl = num.mantiss.split("");
	fl.unshift("1");
	fl.reverse();
	for (var r = 0; r < fl.length;r++)
		fl[r] = Number(fl[r]);
	return fl;
}

function Sum(float1, float2) {
	if (float1.order == float2.order) {
		var fl1 = Prepare(float1);
		var fl2 = Prepare(float2);
		var order = parseInt(float1.order, 2) -127;
	}
	else { //Приводим к порядку большего
		if (float1.order > float2.order) {
			var fl1 = Prepare(float1);
			var fl2 = Prepare(float2);
			var order = parseInt(float1.order, 2) -127;
			for (var j = 0; j < parseInt(float1.order, 2) - parseInt(float2.order, 2); j++) {
				fl2.shift();
				fl2.push(0);
			}
		}
		else {
			var fl1 = Prepare(float1);
			var fl2 = Prepare(float2);
			var order = parseInt(float2.order, 2) -127;
			for (var j = 0; j < parseInt(float2.order, 2) - parseInt(float1.order, 2); j++) {
				fl1.shift();
				fl1.push(0);
			}
		}
	}
	var sum = new Array();
	var rem = 0;
	for (var i = 0; i < fl1.length; i++) {
		if (fl1[i]+fl2[i] == 2) {
			sum.push(rem);
			rem = 1;
		}
		else if (fl1[i]+fl2[i] == 1)
			sum.push(1 - rem);
		else if (fl1[i]+fl2[i] == 0) {
			sum.push(rem);
			rem = 0;
		}
	}
	if (rem != 0)
		sum.push(rem);
	sum.reverse();
	while (sum.length > 24) {
		order++;
		sum.pop();
	}
	order = MakeOrder(order);
	sum.shift();
	return new FloatNumber(0, order, sum.join(""));
}

function Sub(float1, float2) {
	if (float1.order == float2.order) {
		if (float1.mantiss == float2.mantiss) return ConvertToFloat("0");
		var fl1 = Prepare(float1);
		var fl2 = Prepare(float2);
	}
	else { //Приводим к порядку большего (считаем, что всегда из большего вычитаем меньшее)
		var fl1 = Prepare(float1);
		var fl2 = Prepare(float2);
		for (var j = 0; j < parseInt(float1.order, 2) - parseInt(float2.order, 2); j++) {
			fl2.shift();
			fl2.push(0);
		}
	}
	var sub = new Array();
	for (var i = 0; i < fl1.length; i++) {
		if (fl1[i]-fl2[i] == 0)
			sub.push(0);
		else if (fl1[i]-fl2[i] == 1)
			sub.push(1);
		else if (fl1[i]-fl2[i] == -1) {
			sub.push(1);
			for (var j = 1; j < fl1.length - i; j++) {
				if (fl1[i+j] == 1) {
					fl1[i+j] = 0;
					break;
				}
				else
					fl1[i+j] = 1;
			}
		}
	}
	sub.reverse();
	var order = parseInt(float1.order, 2) -127;
	while (sub[0] != 1) {
		order--;
		sub.shift();
		sub.push(0);
	}
	sub.shift();
	order = MakeOrder(order); 
	return new FloatNumber(0, order, sub.join(""));
}

function WriteNumber(num) {
	for (var e in num) {
		WScript.StdOut.Write(num[e]);
		WScript.StdOut.Write(" ");
	}
}
function CheckResult() {
	WSH.echo(eval(S));
	var f = eval(S).toString();
	var exp = ConvertToFloat(f);
	WriteNumber(exp);
	WSH.echo("Expected");
}

var S = WScript.StdIn.ReadLine();
S = S.split(" ").join("");
var result;

if (WSH.Arguments(0) == "conv"){
	result = ConvertToFloat(S);
	WriteNumber(result);
}
else if (WSH.Arguments(0) == "calc") {
	var Fnum1 = ConvertToFloat(S.match(/(\d+\.?\d*)/g)[0]);
	var Fnum2 = ConvertToFloat(S.match(/(\d+\.?\d*)/g)[1]);
	WriteNumber(Fnum1);
	WSH.echo();
	WriteNumber(Fnum2);
	WSH.echo();
	var operation = S.match(/[+-]/)[0];
	if (operation == "+")
		result = Sum(Fnum1,Fnum2);
	else if (operation == "-")
		result = Sub(Fnum1, Fnum2);
	WriteNumber(result);
	CheckResult();
}
