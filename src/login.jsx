import React, { useState } from "react";
import "./Login.css";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = (e) => {
e.preventDefault();

```
if (email === "" || password === "") {
  alert("Please fill in all fields");
} else {
  alert("Login Successful!");
}
```

};

return ( <div className="login-container"> <h2>Login</h2>

```
  <form onSubmit={handleSubmit} className="login-form">
    <input
      type="email"
      placeholder="Enter Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Enter Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button type="submit">Login</button>
  </form>
</div>

);
}

export default Login;