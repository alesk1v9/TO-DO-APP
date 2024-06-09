import { gql } from "@apollo/client";

// retrieve user by username alog with its tasks
export const QUERY_USER = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            tasks {
                _id
                title
                description
                priority
                dueDate
            }
        }
    }
`;

// retrieve all tasks(I think we are not gonna need it)
export const QUERY_TASKS = gql`
query getTasks {
    tasks {
        _id
        title
        description
        dueDate
        priority
         
    }
}
`;

// retrieve a single task
export const QUERY_SINGLE_TASK = `
    query getSingleTask($taskId: ID!) {
        task(taskId: $taskID) {
            _id
            title
            description
            dueDate
            priority
            
        }
    }
`