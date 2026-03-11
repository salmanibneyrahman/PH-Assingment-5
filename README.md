1️⃣ What is the difference between var, let, and const?

ans: 
var, let, and const are used to declare variables in JavaScript, but they behave differently.

var is the old way of declaring variables. It is function-scoped, which means it works inside a whole function even if it’s declared inside a block. Because of this, it can sometimes cause unexpected bugs.

let was introduced in ES6. It is block-scoped, meaning it only works inside the block { } where it is declared. Unlike var, it cannot be redeclared in the same scope.

const is also block-scoped like let, but its value cannot be reassigned after it is declared. It is usually used for values that should not change.


2️⃣ What is the spread operator (...)?

ans:
The spread operator (...) is used to expand elements of an array or object. It allows us to copy or combine data easily. For example, if there are two separate lists of numbers, the spread operator can be used to quickly combine them into one single list by spreading the items of both into a new array.


3️⃣ What is the difference between map(), filter(), and forEach()?

ans:
These three are array methods, but they are used for different purposes.

map() creates a new array by applying a function to every element.

filter() creates a new array with elements that pass a condition.

forEach() simply loops through the array but does not return a new array.


4️⃣ What is an arrow function?

ans:
An arrow function is a shorter way to write functions in JavaScript using a specific symbol (=>). It was introduced in ES6 and makes code cleaner and easier to read.


5️⃣ What are template literals?

ans:
Template literals are a modern way to create strings in JavaScript using backticks ` ` instead of quotes. They allow us to insert variables directly inside a string using ${}.