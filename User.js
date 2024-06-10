// require schema and model from mongoose
const { Schema, model } = require("mongoose");
// require bcrypt
const bcrypt = require('bcrypt');

// cretaes a new instance of the schema class and configure properties
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
    },
    email: {
        type: String,
        unique: true,
        required: "Email is Required",
        match: [/.+@.+\..+/],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
});

// check if user is new or modified using mongoose methods 
// and then use bcrypt to hash and save in db

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
})

// creates a custom method to compare passwords using bcrypt
userSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);
// exports model
module.exports = User;