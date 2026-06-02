const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

async function runChat(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Gemini Clone"
      },
      body: JSON.stringify({
        // CHANGED: Switched from the deprecated '-exp:free' model to an active one
        model: "google/gemini-2.5-flash", 
        max_tokens: 1000,   
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log("Full response:", data);

    if (data.error) {
      console.error("API Error:", data.error.message);
      return "Error: " + data.error.message;
    }

    // Ensure the structure exists before mapping it to avoid crashing the app
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }
    
    return "No response received from the model.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Network error. Please try again.";
  }
}

export default runChat;