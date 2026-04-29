import React, { useState } from "react";
import { loginUser } from "../../api/accounts";
const LoginForm = () => {
  const [username,setUsername]=useState(""); const [password,setPassword]=useState("");
  const handleSubmit=async(e)=>{ e.preventDefault(); const res=await loginUser({username,password}); console.log(res); }
  return (<form onSubmit={handleSubmit}><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password"/><button type="submit">Login</button></form>);
};
export default LoginForm;
