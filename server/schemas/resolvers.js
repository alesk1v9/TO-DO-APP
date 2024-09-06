const Task = require('../models/Task');
const User = require('../models/User');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-errors')

const resolvers = {
    // queries to read and retrieve data from db
    Query: {
        // returns users along with their tasks
        users: async () => {
            return await User.find().populate('tasks');
        },
        // returns one user found by username and its tasks
        user: async (parent, { username }) => {
            const user = await User.findOne({ username }).populate('tasks');
            if (user) {
                user.tasks = await Task.find({ createdBy: username });
            }
            return user;
        },
        // returns all tasks from a specific user found by username ans sort using createdAt
        tasks: async (parent, { username }) => {
            const params = username ? { createdBy: username } : {};
            return Task.find(params).sort({ createdAt: -1 });
        },
        // returns one task by its ID
        task: async (parent, { taskID }) => {
            return Task.findOne({ _id: taskID });
        },
    },

    Mutation: {
        // creates new user and generate token
        addUser: async (parent, {username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user }
        },

        // logs in and returns a jwt token if password and email are correct 
        // otherwise returns an authentication error
        login: async (parent, {email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        },

        // add task
        addTask: async (parent, { title, createdBy, description, priority, dueDate }) => {

            const task = await Task.create({ 
                    title,
                    createdBy,
                    description,
                    priority,
                    dueDate });
            return task;
        },
        // remove task
        removeTask: async (parent, { taskID }) => {
            const task = await Task.findOneAndDelete({ _id: taskID });
            return `${task}, task deleted!`;
        },
        // update task
        updateTask: async (parent, { taskID, title, description, priority, dueDate }) => {
            
            const task = await Task.findOneAndUpdate(
                { _id: taskID },
                { $set: {
                    title,
                    description,
                    priority,
                    dueDate
                }
             },
                { runValidators: true, new: true }
            );
            console.log('Updated task:', task);
            return task;
        },
    },
};

module.exports = resolvers;