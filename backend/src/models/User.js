const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    profession: {
        type: String,
        required: true
    },
    employer: {
        type: String,
        required: true
    },
    monthlySalary: {
        type: Number,
        required: true
    },
    capital:{
        type: Number,
        default: 0
    },
    skills: [
        {
            type: String
        }
    ],
    role:{
        type: String,
        enum: ['EMPLOYEE', 'MENTOR', 'ADMIN'],
        default: 'EMPLOYEE'
    },
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);