
import './homePage.css'
import { HeaderComponenet } from '../../components/header/header'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const PAGE_SIZE = 10

export const HomePage = ({ email }) => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [activeImageId, setActiveImageId] = useState(null)
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
      const response = await axios.get(`${API_BASE_URL}/api/v1/images`, {
        params: {
          page: requestedPage,
          limit: PAGE_SIZE,
          category: selectedFilter || undefined,
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
  }, [selectedFilter])

  useEffect(() => {
    setImages([])
    pageRef.current = 1
    hasMoreRef.current = true
    setHasMore(true)
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
  const isAdmin = role === 'admin' && Boolean(localStorage.getItem('token'))

  const PicturesFunc = () => {
    return (
      images.map((item) => {
        async function deleteImage(){
          try {
            await axios.delete(`${API_BASE_URL}/api/v1/images/${item._id}`,{
              headers:{
                "Authorization": `Bearer ${localStorage.getItem('token')}`
              }
            })
            setImages((currentImages) => currentImages.filter((image) => image._id !== item._id))
          } catch (error) {
            console.error('Failed to delete image:', error)
          }
        }
        const downloadUrl = item.url.includes('/upload/')
          ? item.url.replace('/upload/', '/upload/fl_attachment/')
          : item.url

        return (
          <div key={item._id} className='image-box'>
            <img
              className="item-image"
              src={item.url}
              role="button"
              tabIndex={0}
              aria-label={`Show actions for image ${item._id}`}
              aria-pressed={activeImageId === item._id}
              onClick={() => setActiveImageId((currentId) => currentId === item._id ? null : item._id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setActiveImageId((currentId) => currentId === item._id ? null : item._id)
                }
              }}
            />
            <div
              className={`image-actions${activeImageId === item._id ? ' image-actions-visible' : ''}`}
              onClick={(event) => event.stopPropagation()}
            >
              {isAdmin ? (
                <button className="image-action delete-action" onClick={deleteImage}>delete</button>
              ) : (
                              <a
                className="image-action download-action"
                href={downloadUrl}
                download
              >download</a>
              )}
              <a
                className="image-action download-action"
                href={downloadUrl}
                download
              >download</a>
            </div>
          </div>
        )
      })
    )
  }

  return (
    <>
      <HeaderComponenet email={email} />
      <div className='filter-container'>
        <div>Filter :</div>
        <div>
          <label htmlFor='filter-windows'>windws</label>
          <input id='filter-windows' type='checkbox' checked={selectedFilter === 'windows'} onChange={(event) => setSelectedFilter(event.target.checked ? 'windows' : '')} />
        </div>
        <div>
          <label htmlFor='filter-doors'>doors</label>
          <input id='filter-doors' type='checkbox' checked={selectedFilter === 'doors'} onChange={(event) => setSelectedFilter(event.target.checked ? 'doors' : '')} />
        </div>
        <div>
          <label htmlFor='filter-gates'>gate</label>
          <input id='filter-gates' type='checkbox' checked={selectedFilter === 'gates'} onChange={(event) => setSelectedFilter(event.target.checked ? 'gates' : '')} />
        </div>
      </div>
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
      </div>
    </>
  )
}
