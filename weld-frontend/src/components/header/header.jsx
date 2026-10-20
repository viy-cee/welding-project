import './header.css'
import profilepic from '../../images/grinder.jpg'
import { Link } from 'react-router'
import { useEffect, useRef, useState } from 'react'
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
        <div className="site-name"><Link to='/' className='site-name'>Waiso</Link></div>
        <div className="name-info">welding work</div>
      </div>
      <div className="middle-section">
        <input className="search-bar" placeholder="search"/>
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
              ><img className='profile-pic' src={profilepic}/></button>
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
