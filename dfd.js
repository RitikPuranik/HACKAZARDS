async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

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
            role: "system",
            content: "You are an assistant that ONLY replies with a Data Flow Diagram (DFD) in mermaid.js syntax. DO NOT add any explanations. Start directly with 'flowchart TD'."
          },
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
    let dfdText = data.choices?.[0]?.message?.content || "";

    // CLEAN THE RESPONSE
    const flowchartIndex = dfdText.indexOf("flowchart");
    if (flowchartIndex !== -1) {
      dfdText = dfdText.substring(flowchartIndex); // Only keep from "flowchart TD" part
    } else {
      dfdText = "flowchart TD\nA --> B"; // fallback default simple DFD
    }

    addMessage("bot", "✅ DFD Diagram created below!");

    const outputDiv = document.getElementById("dfd-output");
    outputDiv.innerHTML = "";

    const diagramContainer = document.createElement("div");
    diagramContainer.className = "mermaid";
    diagramContainer.textContent = dfdText.trim();

    outputDiv.appendChild(diagramContainer);

    mermaid.init(undefined, diagramContainer);

  } catch (err) {
    console.error(err);
    addMessage("bot", `⚠️ Error: ${err.message}`);
  }
}

function addMessage(sender, content) {
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.textContent = content;
  document.getElementById("chat-messages").appendChild(msg);
  document.getElementById("chat-messages").scrollTop = 9999;
}
