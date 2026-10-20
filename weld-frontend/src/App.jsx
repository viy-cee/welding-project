import { Route, Routes } from 'react-router'

import { HomePage } from './pages/home-page/homePage'
import { AboutPage } from './pages/about-page/aboutPage'
import { FileUpload } from './pages/uploadPage/upload'
import { LoginPage } from './pages/Auth-page/loginPage'
import { RegisterPage } from './pages/Auth-page/registerpage'
import { useState } from 'react'

function App() {
  const [email, setEmail] = useState(() => localStorage.getItem('email') || '')
   const [loginData,setLoginData] = useState({})
  return (
    <Routes>
      <Route path="/" element={<HomePage email={email} />} />
      <Route 
      path="/about" 
      element={<AboutPage
       username={email} 
       loginData={loginData}
       />} 
       />
      <Route 
      path="/upload" 
      element={<FileUpload email={email} />} 
      />
      <Route path="/login" 
      element={<LoginPage 
      email={email}
      setEmail={setEmail}
      loginData={loginData}
      setLoginData={setLoginData}
      />} 
      />
      <Route path="/register" element={<RegisterPage email={email} />} />
      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  )
}

export default App
