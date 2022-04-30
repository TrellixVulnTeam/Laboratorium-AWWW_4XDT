export let komunikat = "Hello world!"

document.addEventListener("submit", validateData, false);

function validateData(event) {
    let form = document.getElementById("name_surname");
    event.preventDefault();

    if (document.getElementById("name").value === "")
        return wrongValidation("name", "name_wrong", "Name must be filled out");

    if (document.getElementById("name").value.length > 40)
        return wrongValidation("name", "name_wrong", "Name must be shorter than 40 characters");

    if (document.getElementById("surname").value === "")
        return wrongValidation("surname", "surname_wrong", "Surname must be filled out");

    if (document.getElementById("surname").value.length > 40)
        return wrongValidation("surname", "surname_wrong", "Surname must be shorter than 40 characters");

    form.submit();

    document.getElementById("name").style.backgroundColor = "";
    document.getElementById("name").style.borderColor = "";

    document.getElementById("surname").style.backgroundColor = "";
    document.getElementById("surname").style.borderColor = "";

    document.getElementById("name_wrong").innerHTML = "";
    document.getElementById("surname_wrong").innerHTML = "";

}

function wrongValidation(id, field, msg) {
    document.getElementById(id).style.backgroundColor = "#ffe6e6";
    document.getElementById(id).style.borderColor = "#b30000";

    let field_elem = document.getElementById(field);
    field_elem.innerHTML = msg;

    return false;
}

let modal = document.getElementById("myModal");

let btn = document.getElementById("myBtn");

let close_button = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
    displayForm();
    setInterval(function () {
        modal.style.display = "none";
    }, 15000);
}

close_button.onclick = function() {
    modal.style.display = "none";
}

function displayForm() {
    let displayForm = document.getElementById("form_summary");

    let number = document.getElementById("ilosc").value.toString();

    displayForm.appendChild(document.createElement("br"));

    let numberText = document.createTextNode(number);

    displayForm.appendChild(document.createTextNode("Rodzaj wycieczki: "));

    if (document.querySelector('input[id = "góry"]:checked')) {
        displayForm.appendChild(document.createTextNode("Góry 10 USD "));
    } else if (document.querySelector('input[id = "morze"]:checked')) {
        displayForm.appendChild(document.createTextNode("Morze 20 USD "));
    } else if (document.querySelector('input[id = "miasto"]:checked')) {
        displayForm.appendChild(document.createTextNode("Miasto 30 USD "));
    } else {
        displayForm.appendChild(document.createTextNode("Brak wybranej wycieczki "));
    }

    displayForm.appendChild(document.createElement("br"));

    displayForm.appendChild(document.createTextNode("Ilość: "));

    displayForm.appendChild(numberText);

}

document.getElementById('surname').addEventListener('focus', function() {
    focusOn('surname');
});

document.getElementById('name').addEventListener('focus', function() {
    focusOn('name');
});

document.getElementById('ilosc').addEventListener('focus', function() {
    focusOn('ilosc');
});

document.getElementById('surname').addEventListener('focusout', function() {
    focusOff('surname');
});

document.getElementById('name').addEventListener('focusout', function() {
    focusOff('name');
});

document.getElementById('ilosc').addEventListener('focusout', function() {
    focusOff('ilosc');
});

function focusOn(id) {
    document.getElementById(id).style.border = "3px solid red";
}

function focusOff(id) {
    document.getElementById(id).style.border = "";
}