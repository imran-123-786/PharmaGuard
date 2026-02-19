let barChart = null;
let pieChart = null;
let lastAnalysisResult = null;

window.showResult = function (data) {
  console.log("Rendering result", data);
  if (!data) return;

  // ================================
  // 🔹 SHOW RESULT PANEL
  // ================================
  document.getElementById("resultPanel").classList.remove("hidden");

  // ================================
  // 🔹 SAFE DATA EXTRACTION
  // ================================
  const drug = data.drug || "—";
  const gene =
    data.pharmacogenomic_profile?.primary_gene || "—";
  const risk =
    data.risk_assessment?.risk_label || "Unknown";
  const confidence = Math.round(
    (data.risk_assessment?.confidence_score || 0) * 100
  );

  // ================================
  // 🔹 TOP INFO CARDS
  // ================================
  document.getElementById("drugInfo").innerText = drug;
  document.getElementById("geneInfo").innerText = gene;
  document.getElementById("riskInfo").innerText = risk;
  document.getElementById("confidenceInfo").innerText =
    confidence + "%";

  // ================================
  // 🔹 RISK BOX
  // ================================
  let colorClass = "safe";
  if (confidence > 70) colorClass = "danger";
  else if (confidence > 40) colorClass = "warning";

  document.getElementById("riskLabel").innerText = risk;
  document.getElementById("riskPercent").innerText =
    confidence + "%";

  const riskBox = document.getElementById("riskBox");
  riskBox.className = `risk-box ${colorClass}`;

  // ================================
  // 🔹 DETECTED GENE HIGHLIGHT
  // ================================
  document
    .querySelectorAll(".gene-list li")
    .forEach(li => li.classList.remove("active-gene"));

  if (gene !== "—") {
    const geneEl = document.getElementById(`gene-${gene}`);
    if (geneEl) geneEl.classList.add("active-gene");
  }

  // ================================
  // 🔹 CHARTS
  // ================================
  const barCtx =
    document.getElementById("riskBarChart").getContext("2d");
  const pieCtx =
    document.getElementById("riskPieChart").getContext("2d");

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["perce"],
      datasets: [
        {
          label: "Risk Confidence %",
          data: [confidence],
          backgroundColor:
            confidence > 70
              ? "#dc3545"
              : confidence > 40
              ? "#ffc107"
              : "#28a745"
        }
      ]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });

  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Safe", "Moderate Risk", "High Risk"],
      datasets: [
        {
          data:
            confidence > 70
              ? [0, 0, 100]
              : confidence > 40
              ? [0, 100, 0]
              : [100, 0, 0],
          backgroundColor: [
            "#28a745",
            "#ffc107",
            "#dc3545"
          ]
        }
      ]
    }
  });

  // ================================
  // 🔹 EXPLANATION
  // ================================
  document.getElementById("explanation").innerText =
    data.llm_generated_explanation?.summary ||
    "Explanation unavailable.";

  // ================================
  // 🔹 DECISION TRACE
  // ================================
  const traceList = document.getElementById("trace");
  traceList.innerHTML = "";
  (data.decision_trace || []).forEach(step => {
    const li = document.createElement("li");
    li.innerText = step;
    traceList.appendChild(li);
  });

  // ================================
  // 🔹 JSON OUTPUT
  // ================================
  document.getElementById("jsonOutput").innerText =
    JSON.stringify(data, null, 2);

  // ================================
  // 🔹 ALTERNATIVE DRUG TABLE
  // ================================
  const altSection =
    document.getElementById("altDrugSection");
  const altBody =
    document.getElementById("altDrugTableBody");

  altBody.innerHTML = "";

  const alternatives =
    data.clinical_recommendation?.alternative_drugs || [];

  if (
    (risk === "Toxic" || risk === "Adjust Dosage") &&
    alternatives.length > 0
  ) {
    altSection.style.display = "block";

    // Current drug
    const mainRow = document.createElement("tr");
    mainRow.innerHTML = `
      <td>${drug}</td>
      <td class="alt-danger">${risk}</td>
      <td>Avoid / Caution</td>
    `;
    altBody.appendChild(mainRow);

    // Alternatives
    alternatives.forEach(d => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${d}</td>
        <td class="alt-safe">Lower Risk</td>
        <td>Consider (Clinician review)</td>
      `;
      altBody.appendChild(row);
    });
  } else {
    altSection.style.display = "none";
  }

  // ================================
  // 🔹 SAVE RESULT FOR CHATBOT + DOWNLOAD
  // ================================
  lastAnalysisResult = data;
  if (typeof setLastAnalysis === "function") {
    setLastAnalysis(data);
  }
};

// ================================
// 🔹 DOWNLOAD REPORT
// ================================
window.downloadReport = function () {
  if (!lastAnalysisResult) {
    alert("Please run analysis first.");
    return;
  }

  const report = {
    generated_at: new Date().toISOString(),
    patient_id: lastAnalysisResult.patient_id,
    drug: lastAnalysisResult.drug,
    primary_gene:
      lastAnalysisResult.pharmacogenomic_profile?.primary_gene,
    risk_assessment:
      lastAnalysisResult.risk_assessment,
    clinical_recommendation:
      lastAnalysisResult.clinical_recommendation,
    explanation:
      lastAnalysisResult.llm_generated_explanation?.summary,
    decision_trace:
      lastAnalysisResult.decision_trace
  };

  const blob = new Blob(
    [JSON.stringify(report, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    `PharmaGuard_Report_${lastAnalysisResult.drug}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
