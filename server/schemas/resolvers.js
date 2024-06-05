const Task = require('../models/Task');
const User = require('../models/User');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    // queries to read and retrieve data from db
    Query: {
        // returns users along with their tasks
        users: async () => {
            return await User.find().populate('tasks');
        },
        // returns one user found by username and its tasks
        user: async (parent, { username }) => {
            return await User.findOne({ username }).populate('tasks');
        },
        // returns all tasks from a specific user found by username ans sort using createdAt
        tasks: async (parent, { username }) => {
            const params = username ? { username } : {};
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
            const user = await findOne({ email });

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
        addTask: async (parent, { title, description, dueDate }) => {
            const task = await task.create({ title, description, dueDate });
            return task;
        },
        // remove task
        removeTask: async (parent, { taskID }) => {
            const task = await task.findOneAndDelete({ _id: taskID });
            return `${task}, task deleted!`;
        },
        // update task
        updateTask: async (parent, { taskID }) => {
            const task = await task.findOneAndUpdate(
                { _id: taskID },
                { $set: req.body },
                { runValidators: true, new: true }
            );
        },
    },
};

module.exports = resolvers;