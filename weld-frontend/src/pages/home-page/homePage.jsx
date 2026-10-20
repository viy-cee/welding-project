
import './homePage.css'
import { HeaderComponenet } from '../../components/header/header'
import { useState,useEffect } from 'react'
import axios from 'axios'

let cachedImages
let imagesRequest

const fetchImages = () => {
  if (cachedImages) return Promise.resolve(cachedImages)
  if (!imagesRequest) {
    imagesRequest = axios.get('http://localhost:3000/api/v1/images')
      .then((response) => {
        cachedImages = response.data.data
        return cachedImages
      })
      .finally(() => {
        imagesRequest = undefined
      })
  }
  return imagesRequest
}

export const HomePage = ({ email })=>{
  const [images,setImages] = useState(() => cachedImages || [])

  useEffect(() => {
    let isMounted = true
    fetchImages()
      .then((imageList) => {
        if (isMounted) setImages(imageList)
      })
      .catch((error) => {
        console.error('Failed to load images:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const role = localStorage.getItem('role')

    const PicturesFunc = ()=>{
      return(
    images.map((item)=>{
      return(
        <div key={item._id} className='image-box'>
        <img className="item-image" src={item.url} />
        { role === 'admin' &&
        <button className="delete">delete</button>
        }
        </div> 
      )
    })
  )
  }
  return(
    <>
    <HeaderComponenet email={email} />
    <div className='item-container'>
     <PicturesFunc /> 
    </div>
    </>
  )
}
