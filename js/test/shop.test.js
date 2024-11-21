const test = require('tape')

const Address = require('../address')
const Shop = require('../shop')
const User = require('../user')


const fsfAddress = new Address("51 Franklin Street", "Fifth Floor", "Boston", "02110", "USA")
const parisAddress = new Address("33 quai d'Orsay", "", "Paris", "75007", "France")

class UserBuilder {
    constructor() {
        this.name = "John Doe";
        this.email = "john.doe@mail.com";
        this.age = 20;
        this.address = fsfAddress;
        this.verified = true;
    }

    withName(name) {
        this.name = name;
        return this;
    }

    withEmail(email) {
        this.email = email;
        return this;
    }

    withMinor() {
        this.age = 17;
        return this;
    }

    withForeign() {
        this.address = parisAddress;
        return this;
    }

    withUnVerified() {
        this.verified = false;
        return this;
    }

    build() {
        return new User({
            name: this.name,
            email: this.email,
            age: this.age,
            address: this.address,
            verified: this.verified
        });
    }
}

test('happy path', t => {
    //Using the builder pattern to create a user
    const user = new UserBuilder().build()

    t.true(Shop.canOrder(user))
    t.false(Shop.mustPayForeignFee(user))
    t.end()
})

test('minor users cannot order from the shop', t => {
    const user = new UserBuilder().withMinor().build()

    t.false(Shop.canOrder(user))
    t.end()
})

test('must be a verified user to order from the shop', t => {
    const user = new UserBuilder().withUnVerified().build()

    t.false(Shop.canOrder(user))
    t.end()
})

//The user was a minor so the condition for the verified check was never run
test('must be a verified and not a minor user to order from the shop', t => {
    const user = new UserBuilder().withMinor().withUnVerified().build()

    t.false(Shop.canOrder(user))
    t.end()
})

test('foreigners must pay foreign fee', t => {
    const user = new UserBuilder().withForeign().build()
    t.true(Shop.mustPayForeignFee(user))
    t.end()
})