// require schema and model from mongoose
const { Schema, model } = require('mongoose');

// construct a new instance of the scheam class and configure its properties 
const taskSchema = new Schema({
    title: {
        type: String,
        required: "Title is required",
    },
    description: {
        type: String,
    },
    completed: { 
        type: Boolean,
    },
    // using built in method to get current date
    // TODO USE DATE METHOD TO SHOW MM/DD/YYYY
    dueDate: {
        type: Date, 
        default: Date.now,
    },
    priority: {
        type: String,
        default: 'Low',
        enum: [ 'Low', 'Medium', 'High'],
    },
},
{
    timestamps: true,
});

const Task = model('Task', taskSchema);

// exports model
module.exports = Task;