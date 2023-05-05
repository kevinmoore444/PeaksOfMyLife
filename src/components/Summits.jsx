import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Summits = () => {
  // Set logged in User
  const [user, setUser] = useState("")

  // State Variables for a Summit
  const [mountainName, setMountainName] = useState("")
  const [year, setYear] = useState()
  const [altitude, setAltitude] = useState()
  const [country, setCountry] = useState("")
  const [image, setImage] = useState("")

  // Get all User Mountains
  const[mountainList, setMountainList] = useState([])

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
// Set User, and then unpack that data
  useEffect(() => {
    axios.get(`http://localhost:8000/api/getUser`, {withCredentials: true})
    .then((res) => setUser(res.data))
    .catch((err) => console.log('This is our get one function: ' + err))
}, [])


// Log a Summit
// Takes in the data from our form and submits it as a post request along with user credentials.
const handleSubmit = (e) => {
  e.preventDefault();
  const mountainObj = {mountainName, year, altitude, country, image}
  axios.post('http://localhost:8000/api/summit', mountainObj, {withCredentials:true})
  .then(res => {
    console.log(res)
})
.catch(err => console.log("This is our create catch error: ", err))
}

//Get and Display all User Summits - sends a get request for all 
// mountains associated with the current user  (this is defined in the controllers) 
//along with json webtoken credentials for authorization purposes - to api/userSummits.
// Then we set the mountainList with all that data, and map it out below. 
useEffect(() => {
  axios.get('http://localhost:8000/api/userSummits', {withCredentials:true})
  .then((res) => {
      setMountainList(res.data)
  })
  .catch((err) => {console.log(err)})
}, [deleteToggle])


// Delete handler
// When the delete toggle it triggers the dependency array in the useEffect function, causing the 
// page to re-render so that the delete appears immediately.
// User must supply credentials in order to delete. 
const handleDelete = (e, id) => {
  axios.delete(`http://localhost:8000/api/summit/${id}`, {withCredentials:true})
  .then((res) => {
    setDeleteToggle(!deleteToggle)
  })
  .catch((err) => {console.log(err)})
}

//Handle File Upload - invoked onChange for the image upload section
//Invokes "convertBase64" which is defined below
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  const base64 = await convertBase64(file);
  console.log(base64)
  setImage(base64);
};

//Converts the file to base64. This is invoked by the handleFileUpload function.
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};







  return (
    <div>
      {/* Heading - logout button invokes the logouthandler function*/}
      <div className='header'>
        <h1>Welcome {user.firstName}</h1>
        <button onClick={logoutHandler} className="btn btn-outline-dark">Log  Out</button>
      </div>

      {/* Add a Summit Form */}
      <h3>Log your new Summit!</h3>
      <div className='summit_form'>
        <form onSubmit={handleSubmit} className='summit_form'>
            <div className='form-group'>
                <input type="text" onChange={(e) => {setMountainName(e.target.value)}} className='form-control' placeholder='Mountain Name*'></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setYear(e.target.value)}} className='form-control' placeholder='Year Completed*'></input>
            </div>
            <div className='form-group'>
                <input type="number" onChange={(e) => {setAltitude(e.target.value)}} className='form-control' placeholder='Altitude (ft.)*'></input>
            </div>
            <div className='form-group'>
                <input type="text" onChange={(e) => {setCountry(e.target.value)}} className='form-control' placeholder='Country*'></input>
            </div>
            <div className='form-group'>
                <input type="file" onChange={(e) => {handleFileUpload(e)}} className='form-control'></input>
            </div>
            <br/>
            <button type="submit" className='btn btn-primary'>Add</button>
            <p color='red'>*indicates required field</p>
        </form>
      </div>
      {/* Display All Summits */}
      <div>
        <h1 style={{fontSize: 30, marginTop: 60, marginBottom:60}}><u>Peaks of My Life</u></h1>
        <table className='table table-hover table-responsive' style={{width: "80%", marginLeft: "auto", marginRight: "auto", fontSize: 18}}>
            <thead>
                <tr>
                    <th style={{width: "15%"}}>Image</th>
                    <th>Name</th>
                    <th>Altitude</th>
                    <th>Country</th>
                    <th>Year</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {/*Mapping out an array of all mountains, defined with brackets as a useState variable above. */}
                {
                    mountainList.map((mountain, idx) => {
                        return(
                            <tr key={idx}>
                              <td><img src={mountain.image} alt="SummitView" height="150px"></img></td>
                              <td>{mountain.mountainName}</td>
                              <td>{mountain.altitude.toLocaleString('en-US')}</td>
                              <td>{mountain.country}</td>
                              <td>{mountain.year}</td>
                              <td><button className='btn btn-outline-primary' style={{marginRight: "10px" }}><Link to={`/update/${mountain._id}`}>Update</Link></button><button className='btn btn-danger' onClick={ (e)=> {window.confirm("Are you sure you want to delete?") && handleDelete(e, mountain._id)}}>Delete</button></td>
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