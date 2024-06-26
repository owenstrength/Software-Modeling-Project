import './App.css'

import Document from './components/Document'

import { useState } from 'react'
import './App.css'

function App() {
  const [editorCount, setEditorCount] = useState(1)

  // MDI handlers
  const handleAddEditor = () => {
    setEditorCount(prevCount => prevCount + 1)
  }

  const handleRemoveEditor = () => {
    if (editorCount > 1) {
      setEditorCount(editorCount - 1)
    }
  }


  return (
    <>
      <div>
        <button onClick={handleAddEditor}>+</button>
        <button onClick={handleRemoveEditor}>-</button>
      </div>
      <div style={{ flexDirection: 'row', display: 'flex' }}>
        {Array.from({ length: editorCount }).map((_, index) => (
          <div key={index}>
            <Document />
          </div>
        ))}
      </div>
    </>
  )
}

export default App
