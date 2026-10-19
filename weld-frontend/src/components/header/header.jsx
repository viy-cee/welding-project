import './header.css'
import profilepic from '../../images/grinder.jpg'
export const HeaderComponenet = ({username,loginData})=>{
  const role = localStorage.getItem('role')
  console.log(role)
  return(
    <div className="header-container">
      <div className="webname">
        <div className="site-name"><a href='/' className='site-name'>Waiso</a></div>
        <div className="name-info">welding work</div>
      </div>
      <div className="middle-section">
        <a className='home-link' href='/'>Home</a>
        <a className='about-link' href='/about'>About</a>
        <a className='contact-link' href='/'>Contact</a>
      </div>
      <div className="auth-section">
        <div><img className='profile-pic' src={profilepic}/></div>
        <div><a href='/login' className='login-header'>{username || 'Login'}</a></div>
        {role ==='admin'
        ?
        <a href='/upload'>create</a>
        :<div>logout</div>
        }
      </div>
    </div>
  )
}
