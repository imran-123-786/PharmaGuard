let lastAnalysis = null;

// Store last analysis result
window.setLastAnalysis = function (data) {
  lastAnalysis = data;
};

window.sendChat = function () {
  const input = document.getElementById("chatMessage");
  const message = input.value.trim();
  if (!message) return;

  addChatMessage(message, "user-msg");
  input.value = "";

  const reply = generateBotReply(message);
  setTimeout(() => {
    addChatMessage(reply, "bot-msg");
  }, 500);
};

function addChatMessage(text, className) {
  const history = document.getElementById("chatHistory");
  const div = document.createElement("div");
  div.className = `chat-message ${className}`;
  div.innerText = text;
  history.appendChild(div);
  history.scrollTop = history.scrollHeight;
}

function generateBotReply(question) {
  if (!lastAnalysis) {
    return "Please run the analysis first so I can help you.";
  }

  const risk = lastAnalysis.risk_assessment.risk_label;
  const drug = lastAnalysis.drug;
  const gene =
    lastAnalysis.pharmacogenomic_profile.primary_gene || "the detected gene";

  const q = question.toLowerCase();

  if (q.includes("risk")) {
    return `Your risk level for ${drug} is "${risk}". This is based on your genetic profile involving ${gene}.`;
  }

  if (q.includes("why")) {
    return `The risk is determined by how your gene ${gene} affects the metabolism of ${drug}.`;
  }

  if (q.includes("safe")) {
    return risk === "Safe"
      ? "Yes, this drug is considered safe for you."
      : "This drug may require caution or adjustment.";
  }

  if (q.includes("hindi")) {
    return `इस दवा (${drug}) का जोखिम स्तर "${risk}" है, जो आपके जेनेटिक प्रोफ़ाइल पर आधारित है।`;
  }

  if (q.includes("kannada")) {
    return `ಈ ಔಷಧ (${drug}) ಗೆ ಅಪಾಯ ಮಟ್ಟ "${risk}" ಆಗಿದೆ.`;
  }

  if (q.includes("tamil")) {
    return `இந்த மருந்து (${drug}) க்கு "${risk}" அபாய நிலை உள்ளது.`;
  }

  if (q.includes("telugu")) {
    return `ఈ మందు (${drug}) కు "${risk}" ప్రమాద స్థాయి ఉంది.`;
  }

  return "I can explain your risk, drug safety, or genetic results. Try asking!";
}
