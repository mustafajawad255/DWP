import "jasmine";
import validate   from "../src/validate";

describe("Validate Not Empty Value", function () {
    var userName: string;

    beforeEach(function () {
       userName="Joe"
    });

    it("should have value in the name", function () {
        expect(validate.validateNotEmpty(userName)).toBe("Joe");
    });
});


describe("Validate email", function () {
    var email: string;

    beforeEach(function () {
       email="Joe@msn.com"
    });

    it("should email be valid", function () {
        expect(validate.validateIsEmail(email)).toBe(true);
    });
});


describe("Validate Phone", function () {
    var phone: string;

    beforeEach(function () {
       phone="+4412345678912"
    });

    it("should phone to be valid", function () {
        expect(validate.validatePhone(phone)).toBe(true);
    });
});

describe("Validate date of brith", function () {
    const dateOfBirth= new Date();

    it("should have valid date of birth", function () {
        expect(validate.validateDateOfBirth(dateOfBirth)).toBe(true);
    });
});

describe("Removing user", function () {
    var users: Person[];

    beforeEach(function () {
        users.push({ 
            name: "Joe", 
            email: "Joe@msn.com", 
            dateOfBirth: new Date(), 
            phoneNumber: "07123456789" 
        });       
    });

    it("should phone to be valid", function () {
        expect(validate.removeUser(users[0])).toBe(true);
    });
});


