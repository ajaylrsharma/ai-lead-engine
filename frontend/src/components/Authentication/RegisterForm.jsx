import React, { useState } from "react";
import { registerUser } from "../../api/accounts";
const RegisterForm = () => {
  const [username,setUsername]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const handleSubmit=async(e)=>{ e.preventDefault(); const res=await registerUser({username,email,password}); console.log(res);}
  return (<form onSubmit={handleSubmit}><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username"/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password"/><button type="submit">Register</button></form>);
};
export default RegisterForm;
