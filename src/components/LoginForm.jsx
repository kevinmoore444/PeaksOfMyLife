import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    // Variables and State Variables for the login form.
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Variables to hold the catch error defined in the submit handler. This is for validation purposes.
    const [errors, setErrors] = useState([]);
    // Initializing navigate to be used in the submit handler.
    const navigate = useNavigate()

    // Prevent default prevents the page from reloading and erasing the state variables.
    // Putting the fields from the form into a user object and passing that, along with
    // login credentials - a Json webtoken for authentication purposes- as part of a Post request.
    // The catch error is meant to respond with errors when submitted fields conflict with the parameters of the user_model.
    const submitHandler = (e) => {
        e.preventDefault()
        const userObj = {firstName, lastName,  email, password, confirmPassword}
        console.log("Here is my login info: ", userObj)
        axios.post(`http://localhost:8000/api/register`, userObj, {withCredentials:true})
        .then(res => {
            navigate('/home')
        })
        .catch(err =>{
            console.log("This is our create page catch error:", err)
            const errorResponse = err.response.data.errors; 
            const errorArr = []; 
            for (const key of Object.keys(errorResponse)) {
            errorArr.push(errorResponse[key].message)
            }
            setErrors(errorArr);
        })        
}

    // Login submits the loginemail and password as a post request. This is received by the route
    // "/api/login" and invokes the function in the controller where all the magic happens.

const loginUser = (e) => {
        e.preventDefault()
        console.log("Here is my login info: ", loginEmail + loginPassword)
        axios.post("http://localhost:8000/api/login", {loginEmail, loginPassword}, {withCredentials:true})
        .then((response) => {
            navigate('/home');
        })
        .catch((err) => {console.log(err)})         
}

    // This is my reg form. On change of the fields in the, the setFirstName will literally set "firstName" and so forth through the form
    // Upon submission, submit handler will be invoked, which will submit these values into the database as a POST request.

  return (
    <div>
        <div className='register'>
        <form onSubmit={submitHandler}>
            <br></br>
            <h2>Register</h2>
            <br/>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder='First Name*'/>
            <br/>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder='Last Name*'/>
            <br/>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email Address*'/>
            <br/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password*'/>
            <br/>
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder='Confirm Password*'/>
            <br/>
            <p color='red'> * indicates required field</p>
            <button className='login_reg_button' type='submit'>Create User</button>

            {/* This line is part of data validations defined in the model and up above in the code */}
            {errors.map((err, index) => <p key={index}>{err}</p>)}
        </form>
        </div>
        <div>
            {/* This is the Login Form */}
            <form onSubmit={loginUser} className='login'>
            <h2>Log In</h2>
            <br/>
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="text" placeholder='Email Address'/>
            <br/>
            <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" placeholder='Password'/>
            <br/>
            <button className='login_reg_button' type='submit'>Log In</button>
            </form>
        </div>

    </div>
  )
}

export default LoginForm