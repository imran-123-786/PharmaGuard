// =======================================
// 🧠 GLOBAL CHATBOT STATE (SAFE)
// =======================================
window.pharmaGuardLastAnalysis = null;

// Called from visualization.js
window.setLastAnalysis = function (data) {
  console.log("✅ Chatbot received analysis:", data);
  window.pharmaGuardLastAnalysis = data;
};

// =======================================
// 💬 SEND CHAT MESSAGE
// =======================================
window.sendChat = function () {
  const input = document.getElementById("chatMessage");
  const message = input.value.trim();
  if (!message) return;

  addChatMessage(message, "user-msg");
  input.value = "";

  const reply = generateBotReply(message);
  setTimeout(() => {
    addChatMessage(reply, "bot-msg");
  }, 400);
};

// =======================================
// 🧾 ADD MESSAGE TO CHAT WINDOW
// =======================================
function addChatMessage(text, className) {
  const history = document.getElementById("chatHistory");
  if (!history) return;

  const div = document.createElement("div");
  div.className = `chat-message ${className}`;
  div.innerText = text;
  history.appendChild(div);
  history.scrollTop = history.scrollHeight;
}

// =======================================
// 🤖 CHATBOT LOGIC
// =======================================
function generateBotReply(question) {
  const data = window.pharmaGuardLastAnalysis;

  if (!data) {
    return "Please run the analysis first so I can help you.";
  }

  const q = question.toLowerCase();

  const drug = data.drug || "this drug";
  const risk =
    data.risk_assessment?.risk_label || "Unknown";
  const confidence = Math.round(
    (data.risk_assessment?.confidence_score || 0) * 100
  );

  const gene =
    data.pharmacogenomic_profile?.primary_gene ||
    "the detected gene";

  // ---------- BASIC QUESTIONS ----------
  if (q.includes("risk")) {
    return `Your risk level for ${drug} is "${risk}" with ${confidence}% confidence.`;
  }

  if (q.includes("gene")) {
    return `The primary gene influencing ${drug} is ${gene}.`;
  }

  if (q.includes("why")) {
    return `The risk is determined by how your gene ${gene} affects the metabolism of ${drug}.`;
  }

  if (q.includes("safe")) {
    return risk === "Safe"
      ? "Yes, this drug is considered safe for you."
      : "This drug may require caution or dosage adjustment.";
  }

  // ---------- MULTI-LANGUAGE ----------
  if (q.includes("hindi")) {
    return `दवा ${drug} के लिए जोखिम स्तर "${risk}" है।`;
  }

  if (q.includes("kannada")) {
    return `${drug} ಔಷಧಿಗೆ ಅಪಾಯ ಮಟ್ಟ "${risk}" ಆಗಿದೆ.`;
  }

  if (q.includes("tamil")) {
    return `${drug} மருந்திற்கு அபாய நிலை "${risk}".`;
  }

  if (q.includes("telugu")) {
    return `${drug} మందుకు ప్రమాద స్థాయి "${risk}".`;
  }

  // ---------- FALLBACK ----------
  return "You can ask about risk, gene, safety, or explanation.";
}
