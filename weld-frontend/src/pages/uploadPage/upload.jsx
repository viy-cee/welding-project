import './upload.css'
import { useState } from "react"
import { HeaderComponenet } from "../../components/header/header";
import axios from 'axios'
export const FileUpload = ({ username }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  function uplodFile(event) {
    if (event.target.files) {
      setFile(event.target.files[0])
      console.log(file)
    }
  }
  async function isUploading() {
    if (uploading) {
      setStatus('wait for upload to finish')
      setTimeout(() => {
        setStatus('uploading...')
      }, 700)
      return
    }
    setUploadProgress(0)
    setUploading(true)
    setStatus('uploading...')

    const formData = new FormData();
    formData.append('file', file)

    try {
      const response = await axios.post("https://httpbin.org/post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round(progressEvent.loaded * 100) / progressEvent.total
            : 0;
          setUploadProgress(progress)
        }
      });

      setStatus('success')
      console.log(response)

      setTimeout(() => {
        setStatus('')
      }, 2000)

      setUploading(false)
      setUploadProgress(100)
    } catch (error) {
      console.log(error)
      setUploadProgress(0)
    }
  }

  return (
    <>
      <HeaderComponenet username={username} />
      <div className='upload-container'>
        <div className='upload-info'>
          <input className="file-input" type="file" onChange={uplodFile} />
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
