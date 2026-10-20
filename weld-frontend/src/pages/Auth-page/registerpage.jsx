import { useState } from "react"
import { useNavigate } from "react-router"
import { HeaderComponenet } from "../../components/header/header"
import './auth.css'
import axios from "axios"
import { Link } from "react-router"
export const RegisterPage = ({ username }) => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [RegisterDetails,setRegisterDetails] = useState({
    username:'',
    email:'',
    password:''
  })
  function registerUser(event){
    const {name, value} = event.target;
    setRegisterDetails((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    })
  }


  const sendForm = async(e)=>{
    e.preventDefault()
    setErrorMessage('')

    try {
      const result = await axios.post('http://localhost:3000/auth/register', RegisterDetails)
      if (result.data.success) {
        navigate('/login')
      } else {
        setErrorMessage(result.data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.')
    }
  }
  return (
    <>
      <HeaderComponenet username={username} />
      <div>
        <div className="login-container">
          <form onSubmit={sendForm} className="login-form">
            <div className="input-container">
              <label>username</label>
              <input
               type="text" 
               placeholder="username" 
               name="username"
               onChange={registerUser}
               />
            </div>
            <div className="input-container">
              <label>email</label>
              <input 
              type="email"  
              placeholder="email" 
              name="email"
              onChange={registerUser}
              />
            </div>
            <div className="input-container">
              <label>password</label>
            <input type="password" placeholder="password"  name="password"
              onChange={registerUser}
              />
            </div>
            {errorMessage && <div role="alert">{errorMessage}</div>}
            <div>already have an account?<Link to="/login">Login</Link></div>
            <button className="register-button" type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  )
}
