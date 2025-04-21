async function generateMindMap() {
  const input = document.getElementById("userInput").value.trim();
  const mindmapDiv = document.getElementById("mindmap");
  const svg = document.getElementById("connector-lines");

  if (!input) {
    alert("Please enter an idea!");
    return;
  }

  mindmapDiv.innerHTML = "";
  svg.innerHTML = "";

  // Simulated response
  const reply = `
    Sub-idea: Features
    Sub-idea: Gameplay Mechanics
    Sub-idea: Marketing Strategies
    Sub-idea: Target Audience
    Sub-idea: Monetization
    Sub-idea: Social Sharing
  `.trim();

  const lines = reply.split('\n').filter(line => line.includes('Sub-idea:'));
  const topics = lines.map(line => line.replace('Sub-idea:', '').trim());

  // Add center node
  const centerNode = document.createElement("div");
  centerNode.className = "center-node";
  centerNode.innerText = input;
  mindmapDiv.appendChild(centerNode);

  const centerX = 500;
  const centerY = 300;
  const radius = 220;

  topics.forEach((text, index) => {
    const angle = (index / topics.length) * (2 * Math.PI);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const branch = document.createElement("div");
    branch.className = "branch";
    branch.innerText = text;
    branch.style.left = `${x}px`;
    branch.style.top = `${y}px`;
    mindmapDiv.appendChild(branch);

    // SVG curved line (optional: you can make it straight if you prefer)
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const midX = (centerX + x) / 2;
    const midY = (centerY + y) / 2 - 40; // curvature
    const d = `M ${centerX} ${centerY} Q ${midX} ${midY}, ${x} ${y}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", "#94a3b8");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    svg.appendChild(path);
  });
}
