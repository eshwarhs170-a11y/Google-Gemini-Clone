import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, SetprevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [messages, setMessages] = useState([]); // ← stores all messages

  const delayPara = (index, nextWord, msgId) => {
    setTimeout(function () {
      setMessages(prev => prev.map(msg =>
        msg.id === msgId
          ? { ...msg, text: msg.text + nextWord }
          : msg
      ))
    }, 75 * index);
  }

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
    setMessages([])
    setInput("")
  }

  const onSent = async (prompt, imageBase64 = null) => {
    const userPrompt = prompt !== undefined ? prompt : input

    setShowResult(true)
    setLoading(true)
    setRecentPrompt(userPrompt)

    if (prompt === undefined) {
      SetprevPrompts(prev => [...prev, userPrompt])
    } else {
      SetprevPrompts(prev => [...prev, userPrompt])
    }

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: userPrompt,
      image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null
    }])

    setInput("")

    // Get response
    const response = await runChat(userPrompt, imageBase64)

    // Format response
    let responseArray = response.split("**")
    let newResponse = ""
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i]
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>"
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>")
    let newResponseArray = newResponse2.split(" ")

    // Add empty bot message
    const msgId = Date.now() + 1
    setMessages(prev => [...prev, {
      id: msgId,
      type: 'bot',
      text: ''
    }])

    setLoading(false)

    // Fill bot message word by word
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i]
      delayPara(i, nextWord + " ", msgId)
    }
  };

  const contextValue = {
    prevPrompts,
    SetprevPrompts,
    setRecentPrompt,
    recentPrompt,
    input, setInput,
    showResult,
    loading,
    resultData,
    messages,
    onSent,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;