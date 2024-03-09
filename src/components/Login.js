import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  // useHistory() hook was in react-router-dom5 but in v6 usenavigate() hook is for redirection
  let navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const host = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    //API Call
    const response = await fetch(`${host}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userCredentials.email,
        password: userCredentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // Save the token and redirect user to the home page or where evre we want
      localStorage.setItem("token", json.authToken);
      props.showAlert(" Logged In Successfully", "success");
      navigate("/"); // Redirecting to the home page
    } else {
      props.showAlert(" Invalid Credentials", "danger");
    }
  };

  const handleonchange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-3">
      <h2>Login to continue with iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userCredentials.email}
            aria-describedby="emailHelp"
            onChange={handleonchange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={userCredentials.password}
            name="password"
            onChange={handleonchange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
