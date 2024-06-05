const typeDefs = `
    type Task {
        _id: ID,
        title: String!
        description: String
        dueDate: String
        completed: Boolean!
    }

    type User {
        _id: ID
        username: String
        email: String
        password: String
        tasks: [Task]
    }

#Payload with token and user

type AuthPayload {

    token: ID!

    user: User
}

type Query {

    users: [User]

    user(username: String): User

    tasks(username: String): [Task]

    task(taskID: ID): Task
}

type Mutation {

    addUser(username: String!, email: String!, password: String!): AuthPayload

    login(emial: String!, password: String!): AuthPayload

    addTask(title: String!, description: String, dueDate: String): Task

    removeTask(taskID: ID!): String

    updateTask(taskID: ID!, title: String, description: String, dueDate: String): Task
}
`

module.exports = typeDefs;