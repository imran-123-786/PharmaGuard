const TRANSLATIONS = {
  hi: {
    Toxic: "खतरनाक",
    "Adjust Dosage": "खुराक समायोजित करें",
    Safe: "सुरक्षित",
    Unknown: "अज्ञात",
    "Clinical Recommendation": "चिकित्सीय अनुशंसा",
    "Possible Symptoms": "संभावित लक्षण",
    "Recommended Actions": "अनुशंसित कार्य"
  },
  kn: {
    Toxic: "ಅಪಾಯಕಾರಿ",
    "Adjust Dosage": "ಮಾತ್ರೆ ಹೊಂದಿಸಿ",
    Safe: "ಸುರಕ್ಷಿತ",
    Unknown: "ಅಜ್ಞಾತ"
  },
  ta: {
    Toxic: "ஆபத்தானது",
    "Adjust Dosage": "மருந்தளவை மாற்றவும்",
    Safe: "பாதுகாப்பானது",
    Unknown: "தெரியாதது"
  },
  te: {
    Toxic: "ప్రమాదకరం",
    "Adjust Dosage": "మోతాదు సర్దుబాటు చేయండి",
    Safe: "సురక్షితం",
    Unknown: "తెలియదు"
  }
};

function t(text, lang) {
  return TRANSLATIONS[lang]?.[text] || text;
}

let barChart = null;
let pieChart = null;
let lastAnalysisResult = null;

window.showResult = function (data) {
  if (!data) return;
const selectedLanguage = document.getElementById("language")?.value || "en";
  document.getElementById("resultPanel").classList.remove("hidden");

  // ================= SAFE DATA =================
  const drug = data.drug || "—";
  const gene = data.pharmacogenomic_profile?.primary_gene || "—";
  const risk = data.risk_assessment?.risk_label || "Unknown";
  const confidence = Math.round(
    (data.risk_assessment?.confidence_score || 0) * 100
  );

  const rec = data.clinical_recommendation || {};
  const action = rec.recommended_action || "No recommendation";
  const dosage = rec.recommended_dosage || "No dosage guidance available";
  const alternatives = rec.alternative_drugs || [];

  // ================= TOP CARDS =================
  drugInfo.innerText = drug;
  geneInfo.innerText = gene;
  riskInfo.innerText = risk;
  confidenceInfo.innerText = confidence + "%";

  // ================= RISK BOX =================
  let colorClass = "safe";
  if (risk === "Unknown") colorClass = "unknown";
  else if (confidence > 70) colorClass = "danger";
  else if (confidence > 40) colorClass = "warning";

  riskLabel.innerText = t(risk, selectedLanguage);
  riskPercent.innerText = confidence + "%";
  riskBox.className = `risk-box ${colorClass}`;

  // ================= CHART RESET =================
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  // ================= BAR CHART =================
  const barColor =
    risk === "Unknown"
      ? "#adb5bd"
      : confidence > 70
      ? "#dc3545"
      : confidence > 40
      ? "#ffc107"
      : "#28a745";

  barChart = new Chart(riskBarChart.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Risk Percentage"],
      datasets: [
        {
          label: "Risk",
          data: [confidence],
          backgroundColor: barColor
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

  // ================= FINAL PIE CHART (REPLACED) =================
  pieChart = new Chart(riskPieChart.getContext("2d"), {
    type: "pie",
    data: {
      labels: ["Low", "Moderate", "High", "Unknown"],
      datasets: [
        {
          data:
            risk === "Unknown"
              ? [0, 0, 0, 100]
              : confidence > 70
              ? [0, 0, 100, 0]
              : confidence > 40
              ? [0, 100, 0, 0]
              : [100, 0, 0, 0],
          backgroundColor: [
            "#28a745",
            "#ffc107",
            "#dc3545",
            "#adb5bd"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 🔥 KEY FIX
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 14,
            padding: 15
          }
        }
      }
    }
  });

  // ================= ALTERNATIVE DRUGS =================
  altDrugTableBody.innerHTML = "";

  if (
    risk !== "Unknown" &&
    (action.toLowerCase().includes("avoid") ||
      action.toLowerCase().includes("adjust")) &&
    alternatives.length > 0
  ) {
    altDrugSection.style.display = "block";

    altDrugTableBody.innerHTML += `
      <tr>
        <td>${drug}</td>
        <td>${action}</td>
        <td>${dosage}</td>
      </tr>
    `;

    alternatives.forEach(d => {
      altDrugTableBody.innerHTML += `
        <tr>
          <td>${d}</td>
          <td>Lower Genetic Risk</td>
          <td>Standard dose</td>
        </tr>
      `;
    });
  } else {
    altDrugSection.style.display = "none";
  }
      // ================= SYMPTOMS & ACTIONS =================
const symptomsSection = document.getElementById("symptomsActionsSection");
const symptomsList = document.getElementById("symptomsList");
const actionsList = document.getElementById("actionsList");

symptomsList.innerHTML = "";
actionsList.innerHTML = "";
   // ================= DRUG SENSITIVITY INDEX =================
const sensitivityScore =
  data.clinical_recommendation?.drug_sensitivity_index ?? 40;

const sensitivityFill = document.getElementById("sensitivityFill");
const sensitivityText = document.getElementById("sensitivityText");

let sensColor = "#28a745";
let sensLabel = "Low Sensitivity";

if (sensitivityScore > 75) {
  sensColor = "#dc3545";
  sensLabel = "High Sensitivity – Toxicity Risk";
} else if (sensitivityScore > 45) {
  sensColor = "#ffc107";
  sensLabel = "Moderate Sensitivity – Dose Adjustment";
}

sensitivityFill.style.width = sensitivityScore + "%";
sensitivityFill.style.backgroundColor = sensColor;

sensitivityText.innerText =
  `${sensitivityScore}% – ${sensLabel}`;
// Backend-provided data
let symptoms = rec.symptoms_if_taken || [];
let actions = rec.actions_if_taken || [];

// ---------- FIXED FALLBACK LOGIC ----------
if (symptoms.length === 0 && actions.length === 0) {

  if (risk === "Toxic") {
    symptoms = [
      "Severe adverse drug reactions",
      "Drug toxicity",
      "Life-threatening side effects"
    ];
    actions = [
      "Stop medication immediately",
      "Seek urgent medical attention",
      "Switch to genetically safer alternative"
    ];
  }

  else if (risk === "Adjust Dosage") {
    symptoms = [
      "Increased side effects at standard dose",
      "Reduced therapeutic response"
    ];
    actions = [
      "Consult physician for dose adjustment",
      "Monitor drug levels if applicable"
    ];
  }

  else if (risk === "Unknown") {
    symptoms = [
      "Unpredictable drug response",
      "Potential adverse effects"
    ];
    actions = [
      "Monitor symptoms closely",
      "Genetic confirmation recommended before continuation"
    ];
  }
}

// ---------- DISPLAY CONTROL ----------
if (symptoms.length > 0 || actions.length > 0) {
  symptomsSection.style.display = "block";

  symptoms.forEach(s => {
    const li = document.createElement("li");
    li.innerText = "⚠️ " + s;
    symptomsList.appendChild(li);
  });

  actions.forEach(a => {
    const li = document.createElement("li");
    li.innerText = "🚑 " + a;
    actionsList.appendChild(li);
  });
} else {
  symptomsSection.style.display = "none";
}
  // ================= EXPLANATION =================
  explanation.innerText =
    risk === "Unknown"
      ? "Insufficient genetic information to determine drug safety."
      : data.llm_generated_explanation?.summary;

  // ================= TRACE =================
  trace.innerHTML = "";
  (data.decision_trace || []).forEach(step => {
    const li = document.createElement("li");
    li.innerText = step;
    trace.appendChild(li);
  });

  // ================= STRUCTURED JSON =================
  lastAnalysisResult = {
    patient_id: data.patient_id,
    drug: data.drug,
    timestamp: data.timestamp,
    risk_assessment: data.risk_assessment,
    pharmacogenomic_profile: data.pharmacogenomic_profile,
    clinical_recommendation: data.clinical_recommendation,
    explanation: data.llm_generated_explanation,
    decision_trace: data.decision_trace
  };

  jsonOutput.innerText = JSON.stringify(lastAnalysisResult, null, 2);
};

// ================= DOWNLOAD =================
window.downloadReport = function () {
  if (!lastAnalysisResult) return alert("Run analysis first.");

  const blob = new Blob(
    [JSON.stringify(lastAnalysisResult, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `PharmaGuard_Report_${lastAnalysisResult.drug}.json`;
  a.click();
};