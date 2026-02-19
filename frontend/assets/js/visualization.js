let barChart = null;
let pieChart = null;
let lastAnalysisResult = null;

window.showResult = function (data) {
  if (!data) return;

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

  riskLabel.innerText = risk;
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