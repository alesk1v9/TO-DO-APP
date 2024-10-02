import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
// import { useNavigate } from "react-router-dom";


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
        <main className="d-flex flex-column align-items-center justify-content-center bg-secondary" >
          <div className="col-6">
            <div className="card border border-3 rounded-3 border-dark">
              <h4 className="card-header text-center bg-dark text-light">Login</h4>
              <div className="card-body bg-secondary">
                  <form className="d-flex flex-column m-3" onSubmit={handleFormSubmit}>
                    <input
                      className="form-input form-control m-3"
                      placeholder="Your email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                    <input
                      className="form-input form-control m-3"
                      placeholder="********"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleChange}
                    />

                    <a className="text-dark fs-6 d-flex align-items-end justify-content-end" href="http://localhost:3000/signup" >create account</a>

                    <button
                      className="btn btn-dark m-3"
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                
    
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