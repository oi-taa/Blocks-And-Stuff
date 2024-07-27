import React , { useState } from 'react'
import './CSS/LoginSignup.css'
const LoginSignup = () => {

  const [state,setState]= useState("Login");
  const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:"",
  });

  const changeHandler =(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }

  const login = async()=>{
    console.log("login executed")
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:"POST",
      headers:{
        Accept:'application/json',
        'Content-Type': 'application/json'
        },
        body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)

    if (responseData.success){
      console.log("User logined successfully")
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }
  
  const signup = async()=>{
    console.log("Signup executed")
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:"POST",
      headers:{
        Accept:'application/json',
        'Content-Type': 'application/json'
        },
        body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)

    if (responseData.success){
      console.log("User created successfully")
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
    

  }


  return (
    <div className='loginsigup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-field">
          {state==="Sign up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your name '/>:<></>}
          <input type="email" name='email' value={formData.email} onChange={changeHandler} placeholder='Email Address'/>
          <input type="password" name='password' value={formData.password} onChange={changeHandler}placeholder='Password'/>
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign up"?
        <p className="loginsignup-login">Already have an Account? <span onClick={()=>{setState("Login")}}>Login here </span></p>:
        <p className="loginsignup-login">Create an Account? <span  onClick={()=>{setState("Sign up")}}>Click here </span></p>}
        

        <div className="loginsignup-agree">
          <input type="checkbox" name='' id =''required />

          <p>By continuing , i agree to the terms of use & provacy policy</p>
        </div>
      </div>

    </div>
  )
}

export default LoginSignup