const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    kullaniciadi: {
        type: String,
        required: true,
        unique: true
    },
    eposta: {
        type: String,
        required: true
    },
    sifre: {
        type: String,
        required: true
    }
});

userSchema.statics.authenticate = async function (username, password) {
    try {
        const user = await this.findOne({ kullaniciadi: username });

        if (!user) {
            throw Error('Böyle bir kullanıcı yok');
        }

        const auth = await bcrypt.compare(password, user.sifre);

        if (auth) {
            return user;
        } 
        else {
            throw Error('Parola hatalı');
        }
    } 
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.sifre = await bcrypt.hash(this.sifre, salt);
        next();
    } 
    catch (error) {
        next(error);
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
