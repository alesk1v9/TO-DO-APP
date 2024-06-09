import { gql } from "@apollo/client";

// add user
export const ADD_USER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
  }
}
`;

// login user
export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// add task
export const ADD_TASK = gql`
  mutation addTask($title: String!, $description: String, $priority: String, $dueDate: String) {
    addTask(title: $title, description: $description, priority: $priority, dueDate: $dueDate) {
        _id
        title
        description
        dueDate
        priority
    }
  }
`;