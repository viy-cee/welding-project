import './header.css'
import { Link } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import axios from'axios'
export const HeaderComponenet = ({email,loginData})=>{
  const [logoutOpen, setLogoutOpen] = useState(false)
  const logoutMenuRef = useRef(null)
  const role = localStorage.getItem('role')
  console.log(role)

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!logoutMenuRef.current?.contains(event.target)) {
        setLogoutOpen(false)
      }
    }

    document.addEventListener('click', closeOnOutsideClick)
    return () => document.removeEventListener('click', closeOnOutsideClick)
  }, [])

  function logout(){
    localStorage.removeItem('username')
    localStorage.removeItem('token')
  }
  const token = localStorage.getItem('token')
  return(
    <div className="header-container">
      <div className="webname">
        <img className="logo-image" src={"http://res.cloudinary.com/as1huibu/image/upload/v1792558261/slgmpwrja4fvwsej9eyc.jpg"} />
        <div>
        <div className="site-name">Waiso</div>
        <div className="name-info">welding work</div>          
        </div>

      </div>
      <div className="middle-section">
       <Link to="/"><div className="home-link">Home</div></Link>
       <Link to="/"> <div className="about-link" href="/about">About</div> </Link> 
       <Link to="/"><div className="contact-link">contuct</div></Link>
      </div>
      <div className="auth-section">
          {
            token
            ?<div className="logout-menu" ref={logoutMenuRef}>
              <button
                type="button"
                className="logout-link"
                aria-expanded={logoutOpen}
                onClick={() => setLogoutOpen(open => !open)}
              >
                <img className='profile-pic' src={
                  "http://res.cloudinary.com/as1huibu/image/upload/v1792560634/bh8ne3fonxnem9xiawoc.jpg"
                }/>
                
                </button>
              <div className={`logout-tooltip${logoutOpen ? ' logout-tooltip-open' : ''}`}>
                <div className="email-name">{email}</div>
                 {role ==='admin' &&<Link to='/upload' onClick={() => setLogoutOpen(false)}>create</Link>}
                <a href="/">
                  <button className="logout-btn" onClick={logout}>logout</button>
                </a>

              </div>
              </div>
            :<Link to='/login' className='login-header'>Login
            </Link>
          }
      </div>
    </div>
  )
}
