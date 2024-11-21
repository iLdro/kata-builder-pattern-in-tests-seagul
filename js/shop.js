class Shop {
    static canOrder(user) {
        if (user.age <= 18) {
            return false
        }

        if (!user.verified) {
            //  Old line : return true || this line should return false => A user can order only if he is verified
            return false

        }

        return true
    }

    static mustPayForeignFee(user) {
        return user.address.country != "USA"
    }
}
module.exports = Shop