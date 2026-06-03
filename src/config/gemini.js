const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

async function runChat(prompt, imageBase64 = null) {
  try {
    // Build message content
    let messageContent
    if (imageBase64) {
      messageContent = [
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
        },
        {
          type: "text",
          text: prompt || "What is in this image?"
        }
      ]
    } else {
      messageContent = prompt
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Gemini Clone"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 1000,
        messages: [{ role: "user", content: messageContent }]
      })
    })

    const data = await response.json()

    if (data.error) {
      console.error("API Error:", data.error.message)
      return "Error: " + data.error.message
    }

    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content
    }

    return "No response received."
  } catch (error) {
    console.error("Fetch Error:", error)
    return "Network error. Please try again."
  }
}

export default runChat