const TaskList = ({ tasks }) => {
  if (!tasks.length) {
    return <h3>No tasks Yet</h3>;
  }

const  { title, description, dueDate, priority } = tasks

  return (
    <div>
      <h3>{title}</h3>
      {tasks &&
        tasks.map((task) => (
          <div key={_id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {title} <br />
              <span style={{ fontSize: '1rem' }}>
                this task due on {dueDate} priority {priority}
              </span>
            </h4>
            <div className="card-body bg-light p-2">
              <p>{description}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TaskList;

