    // import mutations and queries
import { QUERY_USER } from "../utils/queries";
import { DELETE_TASK } from "../utils/mutations";
import { UPDATE_TASK } from "../utils/mutations";
import { ADD_TASK } from "../utils/mutations";
    // graphQL hooks to use query and mutations on client side
import { useQuery, useMutation } from "@apollo/client";
    // import Authentication services
import Auth from "../utils/auth";
    // import react and hooks
import React, { useState, useEffect } from "react"; // useState hook for state control // useEffect for side effects ehrn building the component
import { Await, useNavigate } from "react-router-dom"; // useNavigate hook for navigation control
    // import moment for Date control
import moment from "moment"; 
    // import Icons
import { FaTrash,FaEdit } from 'react-icons/fa';

const Home = () => {

    const [todo, setTodo] = useState({ // set the form state input values as empty
        title: '',
        description: '',
        priority: '',
        dueDate: ''
    });

    const navigate = useNavigate();
    
    const [tasks, setTasks] = useState([]); // define the initial state of tasks as an empty array

    useEffect(() => { // This piece of code will run every time the home is rendered and the side effect is if the user is not logged
        if (!Auth.loggedIn()) { // then navigate will take the user to /login thats why the useEffect is necessary 
            navigate("/login");
        }
    }, [navigate]); // this 2nd argument is an array of dependencies but as it needs
    // to be checked only one time when the component mounts, the array is empty

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
    };

const [addTaskMutation] = useMutation(ADD_TASK); // set up useMutation hook for adding tasks
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
}
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

    const [isEditing, setIsEditing] = useState(false);
    const [editingTaskID, setEditingTaskID] = useState(null);

    const [updateTaskMutation] = useMutation(UPDATE_TASK);
    const updateBtnHandler = async (taskID) => {
        console.log(taskID);
        try {
            const task = tasks.find(task => task._id === taskID);
            const dueDate = moment(+task.dueDate).format('YYYY-MM-DD');
            console.log(task);
            setTodo({
                title: task.title,
                description: task.description,
                dueDate: dueDate,
                priority: task.priority
            });

            setEditingTaskID(taskID);
            setIsEditing(true);

        } catch (error) {
            console.log(error)
        }
    }

    const saveBtnHandler = async (taskID) => {
        
        const task = tasks.find(task => task._id === taskID);
        
        try {
            const { data } = await updateTaskMutation({
                variables: {
                    taskID: taskID,
                    title: todo.title,
                    description: todo.description,
                    priority: todo.priority,
                    dueDate: moment(todo.dueDate).valueOf().toString(), // transform dueDate back to string using moment
                }
            });

            setTasks(tasks.map(task => task._id === taskID ? data.updateTask : task));

            setTodo({
                title: '',
                description: '',
                dueDate: '',
                priority: ''
            });

            setIsEditing(false);
            setEditingTaskID(null);

        } catch (error) {
            console.log('GraphQL Error:', error.graphQLErrors);
            console.log('Network Error:', error.networkError);
            console.log('Message:', error.message);
        }
    }

    return (
        <main className="d-flex flex-column justify-content-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="col-8 border border-3 rounded-3 border-dark m-3">
                <form className="d-flex flex-column m-3">
            <div className="mb-3">
                <label className="form-label text-dark border-1 border-dark border-bottom">Title</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={todo.title} // set the value using the input form title added by user
                    onChange={e => setTodo({ ...todo, title: e.target.value })} // update the state when title input changes
                />
            </div>

            <div className="mb-3">
                <label className="form-label text-dark border-1 border-dark border-bottom">Description</label>
                <textarea
                    className="form-control"
                    placeholder="Description"
                    value={todo.description}
                    onChange={e => setTodo({ ...todo, description: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label text-dark border-1 border-dark border-bottom">Priority</label>
                <select
                    className="form-control"
                    value={todo.priority}
                    onChange={e => setTodo({ ...todo, priority: e.target.value })}
                >
                    <option value="Priority">Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label text-dark border-1 border-dark border-bottom">Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={todo.dueDate}
                    onChange={e => setTodo({ ...todo, dueDate: e.target.value })}
                />
            </div>
            {isEditing ? <button onClick={() => saveBtnHandler(editingTaskID)} className="btn btn-dark"> Save </button>
             : <button onClick={handleFormSubmit} className="btn btn-dark"> Submit </button>}
            
            
            {/* APPEAR SAVE BTN TO SAVE CHANGES ON UPDATE */}
            {error && <div className="alert alert-danger mt-3">Submission failed. Please try again.</div>}
        </form>
                </div>
                {tasks.length ? 
                <div className="col-12 col-md-8 mb-3">
                {loading ? (
                    <div>Loading...</div>
                ):(
                    
                    tasks.map((task) => { // iterate over all tasks and render a div with task data
        
                        const dueDate = new Date(parseInt(task.dueDate)); // Convert dueDate to a Date object

                    const getPriority = (priority) => {
                        switch (priority) {
                            case "High":
                                return "bg-danger";
                            case "Medium":
                                return "bg-warning";
                            case "Low":
                                return "bg-success";
                            default:
                                return "bg-success";
                        }
                    };

                    const getPriorityBorder = (priority) => {
                        switch (priority) {
                            case "High":
                                return "border-danger";
                            case "Medium":
                                return "border-warning";
                            case "Low":
                                return "border-success";
                            default:
                                return "border-success";
                        }
                    };
                
                        return (
                          <div key={task._id} className={`note border border-3 rounded-3 ${getPriorityBorder(task.priority)} m-3`}>
                            <h4 className={`card-header text-light p-2 ${getPriority(task.priority)}`}>
                              {task.title} on {dueDate.toLocaleDateString()} priority {task.priority}</h4>
                            <div className={`card-body m-3 border-bottom ${getPriorityBorder(task.priority)}`}>
                              <p>{task.description}</p>
                            </div>
                            <div className="m-3">
                              <FaEdit onClick={() => updateBtnHandler(task._id)}/> <FaTrash onClick={() => deleteBtnHandler(task._id)}/>
                            </div>
                          </div>
                       ) 
                      })
                )}
            </div> : []
            }
                
            </div>
        </main>
    );
};

export default Home;