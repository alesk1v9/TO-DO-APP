import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../utils/mutations";
import { UPDATE_TASK } from "../../utils/mutations";
import Auth from "../../utils/auth";
import moment from "moment"; 

const TaskForm = ({ addTask, taskToEdit, setTaskToEdit }) => {
    const [todo, setTodo] = useState({
        title: '',
        description: '',
        priority: '',
        dueDate: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setTodo({
                title: taskToEdit.title,
                description: taskToEdit.description,
                priority: taskToEdit.priority,
                dueDate: moment(+taskToEdit.dueDate).format('YYYY-MM-DD'), //transform dueDate to number and convert the date using moment
            });
        }
    }, [taskToEdit]);

    const [updateTaskMutation] = useMutation(UPDATE_TASK);

    const updateTask = async (taskID) => {
        
        try {
            const { data } = await updateTaskMutation({ 
                variables: {
                    taskID: taskToEdit._id,
                    title: todo.title,
                    description: todo.description,
                    priority: todo.priority,
                    dueDate: moment(todo.dueDate).valueOf().toString(), // transform dueDate back to string using moment
                }
             });
             console.log("Updated Task:", data.updateTask);
             
            setTasks(tasks.map(task => task._id === taskToEdit._id ? data.updateTask : task));

            setTaskToEdit(null);

            setTodo({
                title: '',
                description: '',
                dueDate: '',
                priority: ''
            });
        } catch (error) {
            console.log('GraphQL Error:', error.graphQLErrors);
            console.log('Network Error:', error.networkError);
            console.log('Message:', error.message);
        }
    }
    

    const [addTaskMutation, { error }] = useMutation(ADD_TASK); // set up useMutation hook for adding tasks
            // addTaskMutation will be used to send the data from the input form to the server
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const user = Auth.getProfile(); // get logged in user

        try {
            const { data } = await addTaskMutation({
                variables: {
                    title: todo.title,
                    createdBy: user.data.username, // set logged in user as the creator of the new task
                    description: todo.description,
                    dueDate: todo.dueDate,
                    priority: todo.priority,
                },
            });

            
            const newTask = data.addTask; // store the newly created task in a variable
            addTask(newTask); // addTask function process form using the user's input data 

            // Clear form fields after successful submission
            setTodo({
                title: '',
                description: '',
                dueDate: '',
                priority: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={taskToEdit ? updateTask : handleFormSubmit}>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={todo.title} // set the value using the input form title added by user
                    onChange={e => setTodo({ ...todo, title: e.target.value })} // update the state when title input changes
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    placeholder="Description"
                    value={todo.description}
                    onChange={e => setTodo({ ...todo, description: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Priority</label>
                <select
                    className="form-control"
                    value={todo.priority}
                    onChange={e => setTodo({ ...todo, priority: e.target.value })}
                >
                    <option value="">Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={todo.dueDate}
                    onChange={e => setTodo({ ...todo, dueDate: e.target.value })}
                />
            </div>

            {taskToEdit ? (
                <button type="submit" className="btn btn-primary" onClick={updateTask}> Save </button>
            ) : (
                <button type="submit" className="btn btn-primary" onClick={handleFormSubmit}> Submit </button>
            )}

            
            {/* APPEAR SAVE BTN TO SAVE CHANGES ON UPDATE */}
            {error && <div className="alert alert-danger mt-3">Submission failed. Please try again.</div>}
        </form>

    );
};

export default TaskForm;