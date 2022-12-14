import { useEffect, useRef, useState } from 'react'
import useMousePosition from './hooks/useMousePosition'

const images = [
  {
    url: 'https://images.unsplash.com/photo-1633815475307-884ad652b80b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-1',
  },
  {
    url: 'https://images.unsplash.com/photo-1666190486038-945cf8ad9856?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-2',
  },
  {
    url: 'https://images.unsplash.com/photo-1666118704505-068a65b5283f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-3',
  },
  {
    url: 'https://images.unsplash.com/photo-1666133619062-8c3621ba7322?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-4',
  },
  {
    url: 'https://images.unsplash.com/photo-1666130819825-b822593e90bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-5',
  },
  {
    url: 'https://images.unsplash.com/photo-1666122093052-82dda8cff1be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-6',
  },
  {
    url: 'https://images.unsplash.com/photo-1666257413362-371a9d4c487e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-7',
  },
  {
    url: 'https://images.unsplash.com/photo-1666171172464-7bb21cac9b9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-8',
  },
  {
    url: 'https://images.unsplash.com/photo-1666058091325-6a420e4706e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyOHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-9',
  },
  {
    url: 'https://images.unsplash.com/photo-1666258189364-162feedb85fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    id: 'corgi-10',
  },
]

const clientID = `?client_id=${import.meta.env.VITE_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [ref, mousePosition] = useMousePosition()

  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [query, setQuery] = useState('')

  // ref for each image in images.map()
  const imgRef = useRef([])

  // counter to increment on mousemove
  let [imageIndex, setImageIndex] = useState(0)

  // last mouse position
  let [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  // calculate distance from last mouse position
  const distanceFromLast = (x, y) => {
    let distance = Math.hypot(x - lastPos.x, y - lastPos.y)
    return distance
  }

  useEffect(() => {
    if (
      distanceFromLast(mousePosition.left, mousePosition.top) >
      window.innerWidth / 20
    ) {
      imageIndex++
      setImageIndex(imageIndex)
      setLastPos({ x: mousePosition.left, y: mousePosition.top })
      
      if (imgRef.current[0]) {

        imgRef.current[
          imageIndex % images.length
        ].style.top = `${mousePosition.top}px`
        imgRef.current[
          imageIndex % images.length
        ].style.left = `${mousePosition.left}px`
        imgRef.current[imageIndex % images.length].style.zIndex = imageIndex
        imgRef.current[imageIndex % images.length].dataset.status = 'active'
        if (imgRef.current[(imageIndex - 5) % images.length]) {
          imgRef.current[(imageIndex - 5) % images.length].dataset.status =
          'inactive'
        }
      }
    }

  }, [mousePosition])

  const fetchImages = async () => {
    setLoading(true)
    let url
    const urlQuery = `&query=${query}`

    if (query) {
      url = `${searchUrl}${clientID}${urlQuery}`
    } else {
      url = `${mainUrl}${clientID}`
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      // setPhotos(data)

      setPhotos(() => {
        if (query) {
          return data.results
        } else {
          return data
        }
      })

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault(e)
    if (!query) return
    fetchImages()
    return
  }

  return (
    <>
      <div ref={ref} className="app">
        <div>
          {photos.map((photo, index) => {
            return (
              <img
                ref={(ref) => (imgRef.current[index] = ref)}
                src={photo.urls.regular}
                key={photo.id}
                data-status="inactive"
                className="image"
              />
            )
          })}
        </div>
      </div>
      {loading && <h2 className="loading">Loading...</h2>}
      <form className="search-form">
        <input
          type="text"
          placeholder="search"
          className="form-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />
        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          search
        </button>
      </form>
    </>
  )
}

export default App
