import { QUERY_USER } from "../utils/queries";
import { DELETE_TASK } from "../utils/mutations";
import { UPDATE_TASK } from "../utils/mutations";

import { useQuery, useMutation } from "@apollo/client";
import Auth from "../utils/auth";

import TaskList from "../components/TaskList/index";
import TaskForm from "../components/TaskForm/index";

import React, { useState, useEffect } from "react"; // useState hook for state control // useEffect for side effects ehrn building the component
import { useNavigate } from "react-router-dom"; // useNavigate hook for navigation control

const Home = () => {

    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]); // define the initial state of tasks as an empty array

    useEffect(() => { // This piece of code will run every time the home is rendered and the side effect is if the user is not logged
        if (!Auth.loggedIn()) { // then navigate will take the user to /login thats why the useEffect is necessary 
            navigate("/login");
        }
    }, []); // this 2nd argument is an array of dependencies but as it needs
    // to be checked only one time when the component mounts, the array is empty

    if (!Auth.loggedIn()) { // Double-check if the user is not logged in
        return <p>You need to log in to see this page.</p>; // Show message if user is not logged in
    }

    const username = Auth.getProfile().data.username; //get username

    const { loading, data, error } = useQuery(QUERY_USER, { //useQuery to fetch user data using the username
        variables: { username },
        onCompleted: (data) => { // after fetching username, get the user's tasks if there is any 
            setTasks(data?.user?.tasks || []); // set tasks state with fetched tasks or an empty array
        }
    });

    // add new task function
    const addTask = (newTask) => {
        setTasks([...tasks, newTask]); // Append the new task to the existing tasks
        console.log(tasks);
    };

    // delete task function
    const [deleteTaskMutation] = useMutation(DELETE_TASK);
    const deleteBtnHandler = async (taskID) => {

        // when btn clicked the current task gets deleted from ui and db
        try {
            const { data } = await deleteTaskMutation({ variables: { taskID } });
            // update the state by filtering the remaining tasks with different id than the one deleted
            setTasks(tasks.filter(task => task._id !== taskID)); 
        } catch (error) {
            console.log(`Error deleting task: ${error}!`)
        }
    }

    // update task function
    // const [updateTaskMutation] = useMutation(UPDATE_TASK);
    // const updateBtnHandler = async (taskID) => {

    //     const variables = {
    //         id: taskID,
    //         title: task.title,
    //         description: task.description,
    //         priority: task.priority,
    //         dueDate: task.dueDate
    //     }
    //     try {
    //         const { data } = await updateTaskMutation({ variables });

    //         const updatedTask = data.updateTask;

    //         setTasks(prevTasks => prevTasks.map(task => 
    //             task.id === taskID ? updatedTask : task
    //         ));
    //     } catch (error) {
    //         console.log(`Error updating task: ${error}!`)
    //     }
    // }

    return (
        <main>
            <div className="flex-row justify-center">
                <div
                    className="col-12 col-md-10 mb-3 p-3"
                    style={{ border: '1px dotted #1a1a1a' }}
                >
                    <TaskForm addTask={addTask} /> {/* pass addTask as a prop to use on TaskForm component*/}
                </div>
                <div className="col-12 col-md-8 mb-3">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <TaskList deleteBtnHandler={deleteBtnHandler}
                            // updateBtnHandler={updateBtnHandler}
                            username={username}
                            tasks={tasks} // pass delete fn, username and tasks as props to be used in TaskList component
                        />
                    )}
                </div>
            </div>
        </main>
    );
};

export default Home;
