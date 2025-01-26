const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto'); // Hashing Password Inbuilt of NodeJs
const {createTokenForUser} = require('../services/authentication')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profileImage: {
        type: String,
        default: './public/images/images.png'
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = 'NoSalt'
        // Hash the password using the salt
        const hash = createHmac('sha256', salt).update(user.password).digest('hex');
        // Set the salt and hashed password back on the user object
        user.password = hash;
        user.salt = salt;

        next();
    } catch (error) {
        console.error('Error during password hashing:', error);
        next(error);
    }
});

userSchema.static('matchPassword', async function(email, password) {
    const user = this;

    const userFound = await user.findOne({ email });  
    
    if(!userFound) throw new Error('User Not Found');
    
    const salt = userFound.salt;
    const hash = createHmac('sha256', salt).update(password).digest('hex');
    
    if(hash === userFound.password){
        const token  = createTokenForUser(userFound);
        return token;
    } else {
        throw new Error('Password Mismatch');
    }
});


const userModel = model('User', userSchema);

module.exports = userModel;
