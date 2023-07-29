import React from "react";

const Login = () => {
  return (
    <div>
      <div class="align-items-center container d-flex flex-column my-5">
        <h2 class="mb-3">Login</h2>
        {/*<div>{{ message }}</div>*/}
        <form action="{% url 'login' %}" class="mb-3 w-100" method="post">
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
              id="floatingPassword"
              name="password"
              placeholder="Password"
            />
            <label for="floatingPassword">Password</label>
          </div>
          <div class="d-flex justify-content-center">
            <input class="btn btn-dark" type="submit" value="Login" />
          </div>
        </form>
        Don't have an account? <a href="{% url 'register' %}">Register here.</a>
      </div>
    </div>
  );
};

export default Login;
