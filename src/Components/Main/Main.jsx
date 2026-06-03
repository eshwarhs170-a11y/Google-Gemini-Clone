import React, { useContext, useRef, useState, useEffect } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
  const {
    onSent, recentPrompt, showResult,
    loading, messages, setInput, input, newChat
  } = useContext(Context)

  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleImageClick = () => fileInputRef.current.click()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      setImageBase64(base64)
      setUploadedImage(URL.createObjectURL(file))
    }
    reader.readAsDataURL(file)
  }

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice typing not supported. Please use Chrome.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.start()
    setIsListening(true)
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(prev => prev + transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
  }

  const handleSend = () => {
    if (!input.trim() && !imageBase64) return
    onSent(input, imageBase64)
    setUploadedImage(null)
    setImageBase64(null)
  }

  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">

        {!showResult
          ? <>
              <div className="greet">
                <p><span>Hello, Dev.</span></p>
                <p>How can I help you today?</p>
              </div>
              <div className="cards">
                <div className="card" onClick={() => onSent("Explain photosynthesis in simple terms?")}>
                  <p>Explain photosynthesis in simple terms?</p>
                  <img src={assets.compass_icon} alt="" />
                </div>
                <div className="card" onClick={() => onSent("Can you solve this math problem step by step?")}>
                  <p>Can you solve this math problem step by step?</p>
                  <img src={assets.bulb_icon} alt="" />
                </div>
                <div className="card" onClick={() => onSent("What's the difference between callbacks and promises in JavaScript?")}>
                  <p>What's the difference between callbacks and promises in JavaScript?</p>
                  <img src={assets.message_icon} alt="" />
                </div>
                <div className="card" onClick={() => onSent("How should I prepare for GSoC or internships?")}>
                  <p>How should I prepare for GSoC or internships?</p>
                  <img src={assets.code_icon} alt="" />
                </div>
              </div>
            </>
          : <div className='result'>

              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.type === 'user'
                    ? <div className="result-title">
                        <img src={assets.user_icon} alt="" />
                        <div>
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="uploaded"
                              style={{ width: '100px', borderRadius: '10px', marginBottom: '6px' }}
                            />
                          )}
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    : <div className="result-data">
                        <img src={assets.gemini_icon} alt="" />
                        <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                      </div>
                  }
                </div>
              ))}

              {loading && (
                <div className="result-data">
                  <img src={assets.gemini_icon} alt="" />
                  <div className='loader'><hr /><hr /><hr /></div>
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>
        }

        <div className="main-bottom">

          {uploadedImage && (
            <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={uploadedImage}
                alt="uploaded"
                style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #c4c7c5' }}
              />
              <span style={{ fontSize: '13px', color: '#666' }}>Image attached — type your question</span>
              <span
                onClick={() => { setUploadedImage(null); setImageBase64(null) }}
                style={{ cursor: 'pointer', color: 'red', fontSize: '18px' }}
              >✕</span>
            </div>
          )}

          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder={isListening ? '🎤 Listening...' : 'Enter a prompt here'}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            />
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <img
                src={assets.gallery_icon}
                alt="Upload image"
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
                title="Upload image"
              />
              <img
                src={assets.mic_icon}
                alt="Voice input"
                onClick={handleVoice}
                title="Voice typing"
                style={{
                  cursor: 'pointer',
                  filter: isListening ? 'invert(0.5) sepia(1) saturate(5) hue-rotate(80deg)' : 'none'
                }}
              />
              {(input || imageBase64)
                ? <img onClick={handleSend} src={assets.send_icon} alt="Send" style={{ cursor: 'pointer' }} />
                : null
              }
            </div>
          </div>

          <p className='bottom-info'>
            Gemini may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main