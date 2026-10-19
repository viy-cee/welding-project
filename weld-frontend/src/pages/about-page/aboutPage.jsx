import { HeaderComponenet } from "../../components/header/header"
export const AboutPage = ({ username,loginData })=>{
  return(
    <>
    <HeaderComponenet username={username} loginData={loginData} />
    <div>about</div>
    </>
  )
}
