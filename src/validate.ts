
let validated = false;
let succeded = true;

let users: Person[] = [];

class ValidableInput {
    input: HTMLInputElement;
    validations: ((input: HTMLInputElement) => boolean | String)[];
    associatedInputs: ValidableInput[] = [];

    constructor(
        input: HTMLInputElement,
        ...validations: ((input: HTMLInputElement) => boolean | String)[]
    ) {
        this.input = input;
        this.validations = validations;

        input.addEventListener("input", () => {            
            if (input.validationMessage === "") return;
            this.validate();
        });

        input.addEventListener("focusout", () => {
            if (input.value === "") return;

            this.input.classList.add("visited");
            this.validate();
        });

        input.addEventListener("focusin", () => {
            if (input.validationMessage === "") return;
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
                input.validate();
            }
        }

        return true;
    }
}

//Removing user
function removeUser(key:number) {

    const index = users[key];

    if (index != null ) {
        users.splice(key, 1);
        renderData();
    }
    
}

// Validation
function validateNotEmpty(input: HTMLInputElement) {
    return input.value !== "" || "Field should not be empty";
}

function validateIsEmail(input: HTMLInputElement) {
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    
    return (
        emailRegex.test(input.value ?? "") ||
        `Email '${input.value}' is incorrect, should be (name@domain.domain)`
    );
}

function validatePhone(input: HTMLInputElement) {
    
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    
    return (
        phoneRegex.test(input.value ?? "") ||
        `Phone number '${input.value}' is incorrect`
    );
}

function validateDateOfBirth(input: HTMLInputElement) {
    const date = new Date(input.value);    
    return !isNaN(date.getTime());
}

// Rendering
function renderData() {
   
    output.innerHTML='';    

    for (let i = 0; i < users.length; i++) {        

        output.innerHTML +=`Name: ${users[i].name}, 
        Email: ${users[i].email}, 
        Date of Birth: ${users[i].dateOfBirth.toLocaleDateString('en-GB')}, 
        Phone Number: ${users[i].phoneNumber} 
        <button class='remove' onClick='removeUser(${i})' id='userId${[i]}'>remove</button> <br /><br />`;
     }   
}

const form = document.querySelector("form")!;

const output = document.getElementById('output') || new HTMLElement();

const remove = document.getElementById('remove');


//Inputs
const nameInput = new ValidableInput(
    form.querySelector("input[name = 'fullName']")!,
    validateNotEmpty    
);

const emailInput = new ValidableInput(
    form.querySelector("input[name = 'email']")!,
    validateNotEmpty,
    validateIsEmail
);

const dateOfBirthInput = new ValidableInput(
    form.querySelector("input[name = 'dateOfBirth']")!,
    validateNotEmpty,
    validateDateOfBirth
);

const phoneNumberInput = new ValidableInput(
    form.querySelector("input[name = 'phoneNumber']")!,
    validateNotEmpty,
    validatePhone
);


//Submit
form.addEventListener("submit", (ev: SubmitEvent) => {
    
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
