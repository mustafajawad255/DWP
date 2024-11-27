"use strict";
let validated = false;
let succeded = true;
let users = [];
class ValidableInput {
    constructor(input, ...validations) {
        this.associatedInputs = [];
        this.input = input;
        this.validations = validations;
        input.addEventListener("input", () => {
            if (input.validationMessage === "")
                return;
            this.validate();
        });
        input.addEventListener("focusout", () => {
            if (input.value === "")
                return;
            this.input.classList.add("visited");
            this.validate();
        });
        input.addEventListener("focusin", () => {
            if (input.validationMessage === "")
                return;
            this.validate(true);
        });
    }
    validate(reportValidity = false) {
        for (const validation of this.validations) {
            const validationResult = validation(this.input);
            if (validationResult !== true) {
                this.input.setCustomValidity(String(validationResult));
                if (reportValidity) {
                    this.input.reportValidity();
                }
                return false;
            }
        }
        this.input.setCustomValidity("");
        for (const input of this.associatedInputs) {
            if (input.input.validationMessage !== "") {
                console.log(input);
                input.validate();
            }
        }
        return true;
    }
}
function removeUser(key) {
    const index = users[key];
    if (index != null) {
        users.splice(key, 1);
        renderData();
    }
}
function validateNotEmpty(input) {
    return input.value !== "" || "Field should not be empty";
}
function validateIsEmail(input) {
    var _a;
    const emailRegex = /^\S+@\S+\.\S+$/;
    return (emailRegex.test((_a = input.value) !== null && _a !== void 0 ? _a : "") ||
        `Email '${input.value}' is incorrect, should be (name@domain.domain)`);
}
function validatePhone(input) {
    var _a;
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    return (phoneRegex.test((_a = input.value) !== null && _a !== void 0 ? _a : "") ||
        `Phone number '${input.value}' is incorrect`);
}
function validateDateOfBirth(input) {
    const date = new Date(input.value);
    return !isNaN(date.getTime());
}
function renderData() {
    output.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        output.innerHTML += `Name: ${users[i].name}, 
        Email: ${users[i].email}, 
        Date of Birth: ${users[i].dateOfBirth.toLocaleDateString('en-GB')}, 
        Phone Number: ${users[i].phoneNumber} 
        <button class='remove' onClick='removeUser(${i})' id='userId${[i]}'>remove</button> <br /><br />`;
    }
}
const form = document.querySelector("form");
const output = document.getElementById('output') || new HTMLElement();
const remove = document.getElementById('remove');
const nameInput = new ValidableInput(form.querySelector("input[name = 'fullName']"), validateNotEmpty);
const emailInput = new ValidableInput(form.querySelector("input[name = 'email']"), validateNotEmpty, validateIsEmail);
const dateOfBirthInput = new ValidableInput(form.querySelector("input[name = 'dateOfBirth']"), validateNotEmpty, validateDateOfBirth);
const phoneNumberInput = new ValidableInput(form.querySelector("input[name = 'phoneNumber']"), validateNotEmpty, validatePhone);
form.addEventListener("submit", (ev) => {
    const inputs = [
        nameInput,
        emailInput,
        dateOfBirthInput,
        phoneNumberInput
    ];
    inputs.forEach((input) => {
        if (!input.validate()) {
            succeded = false;
        }
    });
    if (succeded) {
        console.log("Validation succeded ✋");
        users.push({
            name: nameInput.input.value,
            email: emailInput.input.value,
            dateOfBirth: new Date(dateOfBirthInput.input.value),
            phoneNumber: phoneNumberInput.input.value
        });
        renderData();
    }
    ev.preventDefault();
});
