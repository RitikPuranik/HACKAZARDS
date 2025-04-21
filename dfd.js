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
            content: `You are a generator of valid Mermaid.js DFD diagrams.
Only return a diagram that starts with: flowchart TD
Use simple node names (A, B, C, etc) and arrows like --> or -- Yes -->.
Avoid special characters, emojis, or square brackets inside square brackets.
Return only plain diagram content — no code blocks, markdown, or explanations.`
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();
    let dfdText = data.choices?.[0]?.message?.content || "";

    // Clean up content
    dfdText = dfdText
      .replace(/```mermaid|```/gi, "")
      .replace(/^\s*flowchart\s+(LR|TD|RL|BT)?/, "flowchart TD") // force TD for vertical
      .trim();

    // If it doesn't start correctly, fallback
    if (!dfdText.startsWith("flowchart TD")) {
      throw new Error("Invalid Mermaid format.");
    }

    const outputDiv = document.getElementById("dfd-output");
    outputDiv.innerHTML = "";

    const diagramContainer = document.createElement("div");
    diagramContainer.className = "mermaid";
    diagramContainer.textContent = dfdText;
    outputDiv.appendChild(diagramContainer);

    await mermaid.run({ nodes: [diagramContainer] });

    addMessage("bot", "✅ DFD Diagram created below!");

  } catch (err) {
    console.error("Mermaid error:", err.message);
    addMessage("bot", `⚠️ Error: ${err.message}`);

    // fallback example
    const fallback = document.createElement("div");
    fallback.className = "mermaid";
    fallback.textContent = `flowchart TD\nA[Invalid Input] --> B[Fallback Diagram]`;
    const outputDiv = document.getElementById("dfd-output");
    outputDiv.innerHTML = "";
    outputDiv.appendChild(fallback);
    await mermaid.run({ nodes: [fallback] });
  }
}

function addMessage(sender, content) {
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.textContent = content;
  document.getElementById("chat-messages").appendChild(msg);
  document.getElementById("chat-messages").scrollTop = 9999;
}


