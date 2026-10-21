
import './homePage.css'
import { HeaderComponenet } from '../../components/header/header'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'

const PAGE_SIZE = 10

export const HomePage = ({ email })=>{
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [loadError, setLoadError] = useState('')
  const pageRef = useRef(1)
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const sentinelRef = useRef(null)

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return

    loadingRef.current = true
    setIsLoading(true)
    setLoadError('')
    const requestedPage = pageRef.current

    try {
      const response = await axios.get('http://localhost:3000/api/v1/images', {
        params: {
          page: requestedPage,
          limit: PAGE_SIZE,
          sortBy: 'category',
          sortOrder: 'asc'
        }
      })
      const nextImages = response.data.data || []
      const moreAvailable = response.data.hasMore ?? nextImages.length === PAGE_SIZE

      setImages((currentImages) => [...currentImages, ...nextImages])
      pageRef.current = requestedPage + 1
      hasMoreRef.current = moreAvailable
      setHasMore(moreAvailable)
    } catch (error) {
      console.error('Failed to load images:', error)
      setLoadError('Could not load images. Please try again.')
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNextPage()
  }, [loadNextPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loadError) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadNextPage()
    }, { rootMargin: '300px' })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, images.length, loadError, loadNextPage])

  const role = localStorage.getItem('role')

    const PicturesFunc = ()=>{
      return(
    images.map((item)=>{
      return(
        <div key={item._id} className='image-box'>
        <img className="item-image" src={item.url} />
        { role === 'admin'
        ?
        <button className="delete">delete</button>
        :
        <a
          className="delete whatsapp-share"
          href={`https://wa.me/?text=${encodeURIComponent(item.url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >share</a>
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
    <div ref={sentinelRef} className='image-load-sentinel' aria-hidden='true' />
    <div className='image-load-status' aria-live='polite'>
      {isLoading && <p>Loading images...</p>}
      {loadError && (
        <div>
          <p role='alert'>{loadError}</p>
          <button type='button' onClick={loadNextPage}>Retry</button>
        </div>
      )}
      {!isLoading && !loadError && images.length === 0 && <p>No images found.</p>}
      {!hasMore && images.length > 0 && <p>You have reached the end.</p>}
    </div>
    </>
  )
}
