import { QUERY_USER } from "../utils/queries";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";

import TaskList from "../components/TaskList/index";
import  TaskForm  from "../components/TaskForm/index";


const Home = () => {
    const username = Auth.getProfile().data.username;
    const { loading, data } = useQuery(QUERY_USER, {
        variables: { username },
      });
    const tasks = data?.tasks || [];
  
    return (
      <main>
        <div className="flex-row justify-center">
          <div
            className="col-12 col-md-10 mb-3 p-3"
            style={{ border: '1px dotted #1a1a1a' }}
          >
            <TaskForm />
          </div>
          <div className="col-12 col-md-8 mb-3">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <TaskList
                tasks={tasks}
                title="Some Feed for Thought(s)..."
              />
            )}
          </div>
        </div>
      </main>
    );
  };
  
  export default Home;
