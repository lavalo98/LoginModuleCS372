//1. Output
console.log("Part1: Hello World");

//2. Variables (Dynamically typed)
console.log("----------Part2: Variables------------")
var x;
x = 5;
console.log(x);
console.log(typeof(x))

x = 2; //Change the value
console.log(x);

x = "abcd"; //Change the value to string type
console.log(x); console.log(typeof(x))

x = true; 
console.log(x); console.log(typeof(x));

//$ is allowed in variable name
$y =99; console.log("$y = " + $y)

//3.More about string
console.log("----------Part3: More string------------")
alphabets = "abcdefghij"
console.log("length = " + alphabets.length) //Print length
console.log(alphabets[0]); //Character array representation
console.log(alphabets[4]);

//4.Operators
//4a. Arithmetic operators
console.log("----------Part4a: Arithmetic Operators------------")
var x = 2 + 2; console.log(x);
var y = x * 3; console.log(y);
var z = y / 5; console.log(z);
var z1 = parseInt(y/5); console.log(z1);
var r = y % 7; console.log(r);

//4b. Relational Operator (< > <= >= )
console.log("----------Part4b: Comparison Operators------------")
x = 6;
y = 5;
console.log(x != y);
console.log(x == y);
console.log(x < y);
console.log(x > y);
console.log(x >= y);
console.log(x <= y);

//4c. Logical Operators
console.log("----------Part4c: Logical Operators------------");
x = true;
y = false;
console.log(x && y);
console.log(x || y);

//6. Array
//array of string
cars = ["Ford", "Chevrolet", "BMW", "Marcedes"];
console.log(cars[2]);//print BMW
scores = [10, 20, 30, 40, 50, 60, 70];
console.log(scores[5]) //print 60

//5. Control Structure
//5a. Branching
console.log("----------Part5a: Branching (if/else/else-if)------------")
score = 60
if (score < 60) {
  letterGrade = "C";
} 
else if (score < 70) {
  letterGrade = "B";
} 
else {
  letterGrade = "A";
}
console.log(letterGrade);

//5b. Loop
console.log("----------Part5bi: while loop------------")
sum = 0;
i = 0;
while (i < 5) {
  sum += i
  i++;
}
console.log("Sum = " + sum);

console.log("----------Part5bii: for loop------------")
sum = 0;
for (i = 0; i < 5; i++) {
  sum += i;
}
console.log("Sum = " + sum);

console.log("----------Part5biii: for loop to access array elements------------")
cars = ["Ford", "Chevrolet", "BMW", "Marcedes"];
for (i = 0; i < cars.length; i++) {
  console.log(cars[i]);
}

console.log("----------Part5biv: for-of loop to access array elements------------")
cars = ["Ford", "Chevrolet", "BMW", "Marcedes"];
for (car of cars) {
  console.log(car);
}


console.log("----------Part5bv: for-in loop to access array elements (Not Correct) it will only print the indices------------")
cars = ["Ford", "Chevrolet", "BMW", "Marcedes"];
for (car in cars) {
    console.log(car);
}

console.log("----------Part5bvi: for-in loop to access key-value store (good example)------------")
carsInfo = {model:"Ford", Year:"1985", color:"Red"};
for (let key in carsInfo) {
  console.log(carsInfo[key]);
}

//6. Function (Since dynamically typed you may not need to specify type)
console.log("----------Part6a: Function taking string as parameter------------")
function sayMyName(name) {
    console.log('Hi, ' + name);
}
sayMyName('Alice');
sayMyName('Bob');

console.log("----------Part6b: Function taking integer as parameter------------")
function addNumbers(num1, num2) {
    var result = num1 + num2;
    console.log(result);
}
addNumbers(7, 21);
addNumbers(3, 10);


