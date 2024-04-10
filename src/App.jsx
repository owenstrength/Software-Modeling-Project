//import { useState } from 'react'
import './App.css'

import RichTextEditor from './components/RichTextEditor'

import { useState } from 'react'
import './App.css'

function App() {
  const [editorCount, setEditorCount] = useState(1)

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
            <RichTextEditor />
          </div>
        ))}
      </div>
    </>
  )
}

export default App
