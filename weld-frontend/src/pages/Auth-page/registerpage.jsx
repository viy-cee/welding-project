import { useState } from "react"
import { useNavigate } from "react-router"
import { HeaderComponenet } from "../../components/header/header"
import './auth.css'
import axios from "axios"
import { Link } from "react-router"
export const RegisterPage = ({ setEmail }) => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [RegisterDetails,setRegisterDetails] = useState({
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
    let accountCreated = false

    try {
      const result = await axios.post('http://localhost:3000/auth/register', RegisterDetails)
      if (result.data.success) {
        accountCreated = true
        const loginResult = await axios.post('http://localhost:3000/auth/login', RegisterDetails)
        const login = loginResult.data

        if (!login.success) {
          setErrorMessage(login.message || 'Account created, but automatic login failed. Please log in.')
          return
        }

        localStorage.setItem('token', login.data)
        localStorage.setItem('role', login.role)
        localStorage.setItem('email', login.email)
        setEmail(login.email)
        navigate('/', { replace: true })
      } else {
        setErrorMessage(result.data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      const fallbackMessage = accountCreated
        ? 'Account created, but automatic login failed. Please log in.'
        : 'Registration failed. Please try again.'
      setErrorMessage(error.response?.data?.message || fallbackMessage)
    }
  }
  return (
    <>
      <HeaderComponenet />
      <div>
        <div className="login-container">
          <form onSubmit={sendForm} className="login-form">
        
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
