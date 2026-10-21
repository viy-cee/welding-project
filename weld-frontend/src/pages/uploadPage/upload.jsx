import './upload.css'
import { useState } from "react"
import { HeaderComponenet } from "../../components/header/header";
import axios from 'axios'
import { NavLink } from 'react-router';
import { API_BASE_URL } from '../../config/api'
export const FileUpload = ({ email }) => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  function uplodFile(event) {
    setFile(event.target.files?.[0] ?? null)
  }
  async function isUploading() {
    if (uploading) return
    if (!file) {
      setStatus('please select a file first')
      return
    }
    if (!category) {
      setStatus('please select a category')
      return
    }

    setUploadProgress(0)
    setUploading(true)
    setStatus('uploading...')

    const formData = new FormData();
    // The backend route uses multerUploadMiddleware.single('image').
    formData.append('image', file)
    formData.append('category', category)

    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('please log in before uploading')
      setUploading(false)
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress)
        }
      });

      setStatus('success')
      if(response.data.success){

      }
      setUploadProgress(100)

      setTimeout(() => {
        setStatus('')
      }, 2000)
    } catch (error) {
      console.error('File upload failed:', error)
      setStatus(error.response?.data?.message || 'upload failed')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <HeaderComponenet email={email} />
      <div className='upload-container'>
        <div className='upload-info'>
          <input className="file-input" type="file" onChange={uplodFile} />
          <div>
            <label>Choose category</label>
            <select required value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="" disabled>Select category</option>
            <option>windows</option>
            <option>doors</option>
            <option>gates</option>
            </select>
          </div>
          {file && (
            <div className='file-info-container'>
              <div>Name: {file.name}</div>
              <div>Size: {Math.round(file.size /1000)} kb</div>
              <div>Type: {file.type}</div>
            </div>
          )
          }
          {
            file && <> <button onClick={isUploading}>upload</button>
              {uploading &&
                <div>
                  <div className="uploading-bar">
                    <div
                      className="progress-color"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className='upload-status'>{status}</div>
                </div>
              }

            </>
          }
        </div>
      </div>
    </>
  )
}
