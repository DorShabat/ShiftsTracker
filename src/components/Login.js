import React from 'react';

const Login = ({ handleLogin, email, setEmail, password, setPassword }) => (
  <div className="login">
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
);

export default Login;
