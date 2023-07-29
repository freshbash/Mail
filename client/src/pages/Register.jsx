import React from "react";

const Register = () => {
  return (
    <div>
      <div class="align-items-center d-flex flex-column">
        <h2 class="mb-3">Register</h2>
        {/*<div>{{ message }}</div>*/}
        <form action="{% url 'register' %}" class="mb-3 w-100" method="post">
          <div class="form-floating mb-3">
            <input
              autofocus
              type="email"
              class="form-control"
              id="username"
              name="email"
              placeholder="Email"
            />
            <label for="username">Email address</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="Password"
            />
            <label for="password">Password</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="confirmation"
              name="confirmation"
              placeholder="Confirm Password"
            />
            <label for="password">Confirm Password</label>
          </div>

          <div class="d-flex justify-content-center">
            <input class="btn btn-dark" type="submit" value="Register" />
          </div>
        </form>
        Already have an account? <a href="{% url 'login' %}">Log In here.</a>
      </div>
    </div>
  );
};

export default Register;
