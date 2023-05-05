import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Countries = () => {
  // Set logged in User
  const [user, setUser] = useState("")

  // State Variables for a Country, as defined in the country model
  const [countryName, setCountryName] = useState("")
  const [year, setYear] = useState()
  const [image, setImage] = useState()
  const [foodRating, setFoodRating] = useState(0)
  const [beautyRating, setBeautyRating] = useState(0)
  const [experienceRating, setExperienceRating] = useState(0)

  // Get all User Countries
  const[countryList, setCountryList] = useState([])

  // Navigate to Another Page
  const navigate = useNavigate()

// Trigger to update page when deleting
  const [deleteToggle, setDeleteToggle] = useState(false)




// LogOut Button
  const logoutHandler = (e) => {
    e.preventDefault()
    axios.get("http://localhost:8000/api/logout")
    .then(res => {
      navigate('/')
    })
    .catch((err) => console.log(err))
  }

// Get Data for Current User
// This is what I use to populate "Welcome Kevin" - have to obtain the current user
// Set User to the response data, and then unpack that data
  useEffect(() => {
    axios.get(`http://localhost:8000/api/getUser`, {withCredentials: true})
    .then((res) => setUser(res.data))
    .catch((err) => console.log('This is our get one function: ' + err))
}, [])


// Log a Summit
// Takes in the data from our form and submits it as a post request along with user credentials.
const handleSubmit = (e) => {
  const countryObj = {countryName, year, image, foodRating, beautyRating, experienceRating}
  axios.post('http://localhost:8000/api/country', countryObj, {withCredentials:true})
  .then(res => {
    console.log(res)
})
.catch(err => console.log("This is our create catch error: ", err))
}

//Get and Display all User Countries - sends a get request for all 
// countries associated with the current user  (this is defined in the controllers) 
//along with json webtoken credentials for authorization purposes - to api/userSummits.
// Then we set the countryList with all that data, and map it out below. 
useEffect(() => {
  axios.get('http://localhost:8000/api/userCountries', {withCredentials:true})
  .then((res) => {
      setCountryList(res.data)
  })
  .catch((err) => {console.log(err)})
}, [deleteToggle])


// Delete handler
// When the delete toggle it triggers the dependency array in the useEffect function, causing the 
// page to re-render so that the delete appears immediately.
// User must supply credentials in order to delete. 
const handleDelete = (e, id) => {
  axios.delete(`http://localhost:8000/api/country/${id}`, {withCredentials:true})
  .then((res) => {
    setDeleteToggle(!deleteToggle)
  })
  .catch((err) => {console.log(err)})
}




  return (
    <div>
      {/* Heading - logout button invokes the logouthandler function*/}
      <div className='header'>
        <h1>Welcome {user.firstName}</h1>
        <button onClick={logoutHandler} className="btn btn-outline-dark">Log  Out</button>
      </div>

      {/* Add a Summit Form */}
      <h3>Log your new Country!</h3>
      <div className='summit_form'>
        <form onSubmit={handleSubmit} className='summit_form'>
            <div className='form-group'>
                <input type="text" onChange={(e) => {setCountryName(e.target.value)}} className='form-control' placeholder='Country Name*'></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setYear(e.target.value)}} className='form-control' placeholder='Year Visited*'></input>
            </div>
            <div className='form-group'>
                <input type="text" onChange={(e) => {setImage(e.target.value)}} className='form-control' placeholder='ImageURL*'></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setFoodRating(e.target.value)}} className='form-control' placeholder='Food Rating (1-10)*'></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setBeautyRating(e.target.value)}} className='form-control' placeholder='Beauty Rating (1-10)*'></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setExperienceRating(e.target.value)}} className='form-control' placeholder='Overall Experience (1-10)*'></input>
            </div>
            <br/>
            <button type="submit" className='btn btn-primary'>Add</button>
            <p color='red'>*indicates required field</p>
        </form>
      </div>
      {/* Display All Countries */}
      <div>

        {/* Stopped working on this right here */}
        <h1><u>Oh The places You'll Go!</u></h1>
        <table className='table'>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Country</th>
                    <th>Year</th>
                    <th>Food (1-10)</th>
                    <th>Beauty (1-10)</th>
                    <th>Overall (1-10)</th>
                </tr>
            </thead>
            <tbody>
              {/*Mapping out an array of all mountains, defined with brackets as a useState variable above. */}
                {
                    mountainList.map((mountain, idx) => {
                        return(
                            <tr key={idx}>
                              <td><img src={mountain.image} alt="SummitView" height="250px"></img></td>
                              <td>{mountain.mountainName}</td>
                              <td>{mountain.altitude.toLocaleString('en-US')}</td>
                              <td>{mountain.country}</td>
                              <td>{mountain.year}</td>
                              <td><button className='btn btn-outline-primary'><Link to={`/update/${mountain._id}`}>Update</Link></button> | <button className='btn btn-danger' onClick={ (e)=> {window.confirm("Are you sure you want to delete?") && handleDelete(e, mountain._id)}}>Delete</button></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
      </div>
    {/* End of Display */}

    </div>
  )
}
// Must export Summits so that it can be imported on the App.js
export default Summits