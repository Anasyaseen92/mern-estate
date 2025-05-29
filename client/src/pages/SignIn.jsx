import React, { useState } from "react";
import {Link ,Navigate,useNavigate} from 'react-router-dom'
function SignIn() {
  const [formData, setformData]=useState({});
  const [error, seterror]=useState(null);
  const [loading, setLoading]=useState(false);
  const navigate = useNavigate();
  const handleChange=(e)=>{
    setformData({
     ...formData,
      [e.target.id]: e.target.value,
    })
  };
 const handleSubmit= async(e)=>{
  e.preventDefault();
  try {
    setLoading(true);
    const res= await fetch('api/auth/signin',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData),
    })
    const data = await res.json();
    console.log(data);
    if(!res.ok){
      setLoading(false);
      seterror(data.message);
      return;
    }
    setLoading(false);
    seterror(null);
    navigate('/');
  } catch (error) {
    setLoading(false);
      seterror(error.message);
  }
 

 }
 
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
       
        <input
          type="email"
          placeholder="email"
          className="border p-3 round-lg"
          id="email"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="password"
          className="border p-3 round-lg"
          id="password"
          onChange={handleChange}

        ></input>

        <button disabled={loading} className="bg-slate-700 p-3 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
        
        {loading ? 'loading...': 'Sign In'} 
        </button>
      </form>
      <div className="flex mt-5 gap-2">
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
        <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
export default SignIn;
