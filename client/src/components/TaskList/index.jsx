import { FaTrash,FaEdit } from 'react-icons/fa';


const TaskList = ({ username, tasks, deleteBtnHandler }) => { // use props to access data from parent component
  if (!tasks.length) { // verify if there is any task to display
    return <h3>No tasks yet</h3>;
  }


  return (
    <div>
      {tasks.map((task) => { // iterate over all tasks and render a div with task data
        
        const dueDate = new Date(parseInt(task.dueDate)); // Convert dueDate to a Date object

        return (
          <div key={task._id} className="note">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {task.title} <br />
              <span style={{ fontSize: '1rem' }}>
                this task due on {dueDate.toLocaleDateString()} priority {task.priority}
              </span>
            </h4>
            <div className="card-body bg-light p-2">
              <p>{task.description}</p>
            </div>
            <div>
              <FaEdit /> <FaTrash onClick={() => deleteBtnHandler(task._id)}/>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;