import React from "react";

function Signup() {
  return (
    <div>
      <h2>Create Account</h2>
      <input type="text" placeholder="Full Name" />
      <br /><br />

      <input type="email" placeholder="Email" />
      <br /><br />

      <input type="password" placeholder="Password" />
      <br /><br />

      <button>Create Account</button>
    </div>
  );
}

export default Signup;
