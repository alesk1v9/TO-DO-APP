import { useState } from "react";
import { Link } from "react-router-dom";
import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";


const Signup = () => {
    // useState to set email and password to be empty
    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [data, setData] = useState();

    // useMutation to execute graphql mutation
    const [addUser, { error }] = useMutation(ADD_USER);
    // updates user data as it type in the input fields
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formState);
    // execute addUser mutation with users data
        try {
            const { data } = await addUser({
                variables: { ...formState },
            });
            console.log(data);
    // if success save token in local storage and redirect
            Auth.login(data.addUser.token);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <main className="flex-row justify-center mb-4">
          <div className="col-12 col-lg-10">
            <div className="card">
              <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
              <div className="card-body">
                {data ? (
                  <p>
                    Success! You may now head{' '}
                    <Link to="/">back to the homepage.</Link>
                  </p>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <input
                      className="form-input"
                      placeholder="Your username"
                      name="username"
                      type="text"
                      value={formState.name}
                      onChange={handleChange}
                    />
                    <input
                      className="form-input"
                      placeholder="Your email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                    <input
                      className="form-input"
                      placeholder="******"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-block btn-primary"
                      style={{ cursor: 'pointer' }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                )}
    
                {error && (
                  <div className="my-3 p-3 bg-danger text-white">
                    {error.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      );
};


export default Signup;