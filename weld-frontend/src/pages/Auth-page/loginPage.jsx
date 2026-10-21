import { useEffect, useRef, useState } from "react"
import { HeaderComponenet } from "../../components/header/header"
import './auth.css'
import axios from 'axios'
import { Link } from 'react-router'
import { useNavigate } from "react-router"


export const LoginPage = ({
  email,
  setEmail,
  loginData,
  setLoginData
}) => {
  const navigate = useNavigate()
  const [loginDetails,setLoginDetails] = useState({
    email:'',
    password:''
  })
  const [loginMessage,setLoginMessage] = useState('')
  const loginMessageTimer = useRef(null)

  function showLoginMessage(message) {
    setLoginMessage(message)
    window.clearTimeout(loginMessageTimer.current)
    loginMessageTimer.current = window.setTimeout(() => setLoginMessage(''), 2000)
  }

  useEffect(() => () => window.clearTimeout(loginMessageTimer.current), [])

  function loginForm(event){
    const {name,value} = event.target
    setLoginDetails((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    })
  }

  const sendLogin = async(e)=>{
    e.preventDefault()
    try {
      const result = await axios.post('http://localhost:3000/auth/login',loginDetails)
      const login = result.data

      if (login.success !== true) {
        showLoginMessage(login.message || 'Login failed. Please try again.')
        return
      }

      localStorage.setItem('token', login.data)
      localStorage.setItem('role', login.role)
      localStorage.setItem('email', login.email)
      setLoginData(login)
      setEmail(login.email)
      navigate('/', { replace: true })
    } catch (error) {
      console.log(error)
      showLoginMessage(error.response?.data?.message || 'Unable to log in. Please try again.')
    }

  }
  return (
    <>
      <HeaderComponenet email={email} loginData={loginData} />
      <div>
        <div className="login-container">
          <form onSubmit={sendLogin} className="login-form">
            <div className="input-container">
              <label>email</label>
              <input 
              type="email"
              placeholder="email"
              name="email"
              onChange={loginForm}
              />
            </div>
            <div className="input-container">
              <label>password</label>
              <input 
              type="password"
              placeholder="password"
              name="password"
              onChange={loginForm}
              />
            </div>
            {loginMessage && <p className="login-error" role="alert">{loginMessage}</p>}
            <div>don't have an account?<Link to="/register">register</Link></div>
            <button type="submit" className="login-button">login</button>
          </form>
        </div>
      </div>
    </>
  )
}
