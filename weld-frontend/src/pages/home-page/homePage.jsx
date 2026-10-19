
import './homePage.css'
import { HeaderComponenet } from '../../components/header/header'
import { useState,useEffect } from 'react'
import axios from 'axios'
export const HomePage = ({ username })=>{
  const [images,setImages] = useState([])

  const getImages = async ()=>{
    const response = await axios.get('http://localhost:3000/api/v1/images')
    setImages(response.data.data)
  }
   useEffect(()=>{
    getImages()
    
  },[])

  console.log(images)

  /*const dataAndInfo = [
    {
      name:'window',
      description:'window type a',
      id:1
    },
        {
      name:'window',
      image: '/product-images/gate2.jpg',
      description:'window type a',
      id:2
    },
        {
      name:'window',
      image: '/product-images/gate3.jpg',
      description:'window type a',
      id:3
    },
        {
      name:'window',
      image: '/product-images/gate5.jpg',
      description:'window type a',
      id:4
    },
      {
      name:'window',
      image: '/product-images/gate6.jpg',
      description:'window type a',
      id:5
    },
          {
      name:'window',
      image: '/product-images/gate7.jpg',
      description:'window type a',
      id:6
    },
          {
      name:'window',
      image: '/product-images/gate8.jpg',
      description:'window type a',
      id:7
    },
          {
      name:'window',
      image: '/product-images/window1.jpg',
      description:'window type a',
      id:8
    }
  ]*/
    const PicturesFunc = ()=>{
      return(
    images.map((item)=>{
      console.log(item)
      return(
        <div key={item._id} className='image-box'>
        <img className="item-image" src={item.url}/>
        </div> 
      )
    })
  )
  }
  return(
    <>
    <HeaderComponenet username={username} />
    <div className='item-container'>
     <PicturesFunc /> 
    </div>
    </>
  )
}
