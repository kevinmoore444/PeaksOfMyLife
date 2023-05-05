import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link} from 'react-router-dom'

const UpdateSummits = () => {
    // Set logged in User
    const [user, setUser] = useState("")
    // State Variables to be updated
    const [mountainName, setMountainName] = useState("")
    const [year, setYear] = useState(0)
    const [altitude, setAltitude] = useState(0)
    const [country, setCountry] = useState("")
    const [image, setImage] = useState("")
    // Initializing the navigate to be used in the handle submit and logout handler
    const navigate = useNavigate()
    // Initializing ID as a parameter to be passed through the useEffect and handle submit functions.
    const {id} = useParams()

    // Get Data for Current User - send the request along with json webtoken credentials.
    // This is in order to populate the Welcome Kevin header.
    useEffect(() => {
    axios.get(`http://localhost:8000/api/getUser`, {withCredentials: true})
    .then((res) => setUser(res.data))
    .catch((err) => console.log('This is our get one function: ' + err))
    }, [])

    // LogOut Button
    const logoutHandler = (e) => {
    e.preventDefault()
    axios.get("http://localhost:8000/api/logout")
    .then(res => {
      navigate('/')
    })
    .catch((err) => console.log(err))
  }


    // Get One Function to populate the form with the data of the current summit.
    useEffect(() => {
        axios.get("http://localhost:8000/api/summit/" + id)
        .then((res) => {
            console.log("This is my update get request: " + res.data)
            const mountain = res.data
            setMountainName(mountain.mountainName)
            setYear(mountain.year)
            setAltitude(mountain.altitude)
            setCountry(mountain.country)
            setImage(mountain.image)
        })
        .catch(err => console.log("This my get one request error: ", err))
    }, [id])

    // Update the data in mongodb and return to home page. Storing the details submitted on the form.
    // Submitting those details along with JSON Webtoken Credentials as a Put request. 
    const handleSubmit = (e) => {
        e.preventDefault()
        const mountainObj ={mountainName, year, altitude, country, image}
        axios.put(`http://localhost:8000/api/summit/${id}`, mountainObj, {withCredentials:true})
        .then((res) => {
            navigate("/home")
        })
        .catch(err => console.log("This my get update request error: ", err))         
    }




  return (
    <div>
        {/* Heading */}
        <div className='header'>
            <h1>Welcome {user.firstName}</h1>
            <button onClick={logoutHandler} className="btn btn-outline-dark">Log  Out</button>
        </div>

        {/* Update Form - populating the form with current values via the get request which takes that data and applies it to the state variables */}
        <h3>Update</h3>
        <div className='summit_form'>
        <form onSubmit={handleSubmit} className='summit_form'>
            <div className='form-group'>
                <input type="text" onChange={(e) => {setMountainName(e.target.value)}} className='form-control' placeholder='Mountain Name*' value={mountainName}></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setYear(e.target.value)}} className='form-control' placeholder='Year Completed*' value={year}></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setAltitude(e.target.value)}} className='form-control' placeholder='Altitude (ft.)*' value={altitude}></input>
            </div>
            <div className='form-group'>
                <input type="text" onChange={(e) => {setCountry(e.target.value)}} className='form-control' placeholder='Country*' value={country}></input>
            </div>
            <div className='form-group'>
                <input type="text" onChange={(e) => {setImage(e.target.value)}} className='form-control' placeholder='ImageURL*' value={image}></input>
            </div>
            <br/>
            <button type="submit" className='btn btn-primary'>Update</button>
            <p color='red'>*indicates required field</p>
        </form>
      </div>




    </div>
  )
}
// Export the functional component to be imported on the App.js
export default UpdateSummits