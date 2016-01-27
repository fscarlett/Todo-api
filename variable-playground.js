// var person = {
// 	name: 'Fox',
// 	age: 21
// };

// function updatePerson (obj) {
// 	// obj = {
// 	// 	name: 'Fox',
// 	// 	age: 22
// 	// };

// 	obj.age = 22;
// }

// updatePerson(person);
// console.log(person);

// Array Example

var grades = [15, 37];

function addGrade (disarray, newGrade) {
	// disarray = [15, 37, 98];
	disarray.push(newGrade);
	debugger;
	// return disarray;
}

// var DISarray = addGrade(grades, 98);
addGrade(grades, 98);
console.log("grades " + grades);
// console.log("DISarray " + DISarray);
