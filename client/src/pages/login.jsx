import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Login = (props) => {
    // useState to set email and password to be empty
    const [formState, setFormState] = useState({ email: '', password: '' });
    // useMutation to execute graphql mutation
    const [login, { error, data }] = useMutation(LOGIN_USER);
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
  // execute login mutation with users data
        try {
            const { data } = await login({
                variables: { ...formState },
            });
            Auth.login(data.login.token);
        //  if success save token in local storage and redirect
        } catch (error) {
            console.log(error)
        }
        // sets email and password back to empty
        setFormState({
            email: "",
            password: "",
        });
    };
    

    return (
      // if data loads correct redict to home page otherwise shows form again
        <main className="flex-row justify-center mb-4">
          <div className="col-12 col-lg-10">
            <div className="card">
              <h4 className="card-header bg-dark text-light p-2">Login</h4>
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
}

export default Login;