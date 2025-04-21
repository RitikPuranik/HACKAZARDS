// Typewriter text setup
const text = "Hi👋 How Can I Help You Today?";
const target = document.querySelector(".typewriter-text");
let i = 0;

// Typewriter Effect Function
function typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 80); // Speed of typing
  }
}

// Call typewriter on window load
window.onload = function () {
  typeWriter();
};

// Send message to Groq API
async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();

  if (text === "") return;

  addMessage("user", text);
  input.value = "";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from AI.";
    addMessage("bot", reply);
  } catch (err) {
    console.error(err);
    addMessage("bot", `⚠️ Error: ${err.message}`);
  }
}

// Add message to chat
function addMessage(sender, content) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.textContent = content;
  document.getElementById("chat-messages").appendChild(message);
  document.getElementById("chat-messages").scrollTop = 9999;
}

// Handle Enter key
function handleKey(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// Image upload handling
function handleImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageElement = document.createElement("img");
    imageElement.src = e.target.result;
    imageElement.style.maxWidth = "200px";
    imageElement.style.margin = "10px 0";

    const message = document.createElement("div");
    message.className = "message user";
    message.appendChild(imageElement);

    document.getElementById("chat-messages").appendChild(message);
    document.getElementById("chat-messages").scrollTop = 9999;

    // Instead of sending the real image, send a fake text to Groq
    sendImageAsText();
  };
  reader.readAsDataURL(file);
}

// This function sends a fake text message to Groq
async function sendImageAsText() {
  const fakeText = "The user uploaded an image. Please respond accordingly.";
  addMessage("user", fakeText);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: fakeText
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from AI.";
    addMessage("bot", reply);
  } catch (err) {
    console.error(err);
    addMessage("bot", `⚠️ Error: ${err.message}`);
  }
}


// Voice input (optional)
function startVoice() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    document.getElementById("userInput").value = event.results[0][0].transcript;
  };

  recognition.onerror = function(event) {
    console.error("Speech recognition error", event);
  };

  recognition.start();
}

