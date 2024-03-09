import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "s",
  });
  let navigate = useNavigate();
  const host = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    //API Call
    const response = await fetch(`${host}/api/user/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userCredentials.name,
        email: userCredentials.email,
        password: userCredentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // Save the token and redirect user to the home page or where evre we want
      localStorage.setItem("token", json.authToken);
      navigate("/"); // Redirecting to the home page
      props.showAlert(" Account Created Successfully", "success");
    } else {
      props.showAlert(" Invalid Credentials", "danger");
    }
  };

  const handleonchange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-3">
      <h2>Signup to continue with iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            minLength={5}
            required
            aria-describedby="emailHelp"
            onChange={handleonchange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
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
            name="password"
            minLength={5}
            required
            onChange={handleonchange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cnfPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cnfPassword"
            name="cnfPassword"
            minLength={5}
            required
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

export default Signup;
