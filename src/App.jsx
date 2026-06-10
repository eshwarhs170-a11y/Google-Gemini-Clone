import React, { useState } from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Main from './Components/Main/Main'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 99
          }}
        />
      )}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <Main onMenuClick={() => setSidebarOpen(prev => !prev)} />
    </>
  )
}

export default App