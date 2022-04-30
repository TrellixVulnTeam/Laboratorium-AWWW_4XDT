// Zadanie 2

function fizzBuzz() {
    for (let i = 1; i <= 100; i++) {
        if (i % 3 === 0 && i % 5 === 0)
            console.log("FizzBuzz");
        else if (i % 3 === 0)
            console.log("Fizz");
        else if (i % 5 === 0)
            console.log("Buzz");
        else
            console.log(i);
    }
}

// fizzBuzz();

// Zadanie 3

function wartoscKoszyka(koszyk, cennik) {
    let suma = 0;
    for (const a of koszyk) {
        if (cennik[a] !== undefined)
            suma += cennik[a];
    }
    return suma;
}

let slownik = {
    spodnie: 170,
    bluza: 100,
    tshirt: 30
};

let lista = ['tshirt', 'kalarepa', 'spodnie'];

// console.log(wartoscKoszyka(lista, slownik));

// Zadanie 4

function changeCase(text) {
    let split = text.split(/(?<=[A-Z])(?=[a-z])|(?<=[a-z])(?=[A-Z])/);
    split.forEach(function(part, index, split) {
        if (part.toUpperCase() === part)
            split[index] = part.toLowerCase();
        else
            split[index] = part.toUpperCase();
    });
    return split.join('');
}

// console.log(changeCase("ojejTRUDNEto"));

// Zadanie 5

function betterParseInt(str) {
    if (str.includes('_')) {
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '_' && (i === 0 || i === str.length - 1 || str[i - 1] < '0'
                || str[i - 1] > '9' || str[i + 1] < '0' || str[i + 1] > '9')) {
                return parseInt(str);
            }
        }
    }
    str = str.replace('_', '');
    return parseInt(str);
}

// console.log(betterParseInt("123_456"));

// Zadanie 6

String.prototype.toInt = function() {
    return betterParseInt(this);
};

let napis = "6_9ech";
let liczba = napis.toInt();
// console.log(liczba);

Array.prototype.extend = function(extension) {
    // for (const e of extension) {
    //     this.push(e);
    // }
    this.push(...extension);
};

let arr1 = ['1', '2', '3'];
let arr2 = ['4', '5', '6'];

arr1.extend(arr2);
// console.log(arr1);

// Zadanie 7

function callback(c) {
    return (c >= 10);
}

function coNajmniejDwa(tablica, callback) {
    let isCallbackTrue = false;
    for (const t of tablica) {
        if (callback(t)) {
            if (isCallbackTrue)
                return true;
            isCallbackTrue = true;
        }
    }
    return false;
}

const tablica = [1, 2, 10, 5, 15];
// console.log(coNajmniejDwa(tablica, callback));

// Zadanie 8

function sortBy(array, key) {
    array.sort((a, b) => {
        if (a[key] < b[key])
            return -1;
        if (a[key] > b[key])
            return 1;
        return 0;
    });
}

const sortArray = [{ a: 4, b: 3, c: 5 }, { a: 2, b: 5, c: 12 }, { a: 4, b: 3, c: 90 }];
// let sortArray = [{ 1: 'h', 2: 'b', 3: 't' }, { 1: 'q', 2: 'a', 3: 'f' }];
sortBy(sortArray, 'a');
// console.log(sortArray);
