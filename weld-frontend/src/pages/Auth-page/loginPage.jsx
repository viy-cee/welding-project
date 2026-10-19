import { useState } from "react"
import { HeaderComponenet } from "../../components/header/header"
import './auth.css'
import axios from 'axios'
export const LoginPage = ({
  username,
  setUsername,
  loginData,
  setLoginData
}) => {
  const [loginDetails,setLoginDetails] = useState({
    email:'',
    password:''
  })

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
    const result = await axios.post('http://localhost:3000/auth/login',loginDetails)

    setLoginData(result.data)
    localStorage.setItem('role',result.data.role)
    
    if(result.data.success === true){
      localStorage.setItem('username', result.data.username)
      setUsername(result.data.username)
    }else{
      setUsername('')
    }
  }
  return (
    <>
      <HeaderComponenet username={username} loginData={loginData} />
      <div>
        <div className="login-container">
          <form action="" method="POST" className="login-form">
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
              type="text"
              placeholder="password"
              name="password"
              onChange={loginForm}
              />
            </div>
            <p></p>
            <div>don't have an account?<a href="/register">register</a></div>
            <button className="login-button" onClick={sendLogin}>login</button>
          </form>
        </div>
      </div>
    </>
  )
}
