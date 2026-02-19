let barChart = null;
let pieChart = null;

window.showResult = function (data) {
  console.log("Rendering result", data);

  const panel = document.getElementById("resultPanel");
  panel.classList.remove("hidden");
// ================================
// 🔹 TOP INFO CARDS (FIXED BINDING)
// ================================
document.getElementById("drugInfo").innerText =
  data.drug || "—";

document.getElementById("geneInfo").innerText =
  data.pharmacogenomic_profile.primary_gene || "—";

document.getElementById("riskInfo").innerText =
  data.risk_assessment.risk_label || "—";

document.getElementById("confidenceInfo").innerText =
  Math.round(data.risk_assessment.confidence_score * 100) + "%";

  // ---------- Risk ----------
  const risk = data.risk_assessment.risk_label;
  const confidence = Math.round(
    data.risk_assessment.confidence_score * 100
  );

  let colorClass = "safe";
  if (confidence > 70) colorClass = "danger";
  else if (confidence > 40) colorClass = "warning";

  document.getElementById("riskLabel").innerText = risk;
  document.getElementById("riskPercent").innerText = confidence + "%";

  const riskBox = document.getElementById("riskBox");
  riskBox.className = `risk-box ${colorClass}`;

  // ---------- Charts ----------
  const barCtx = document
    .getElementById("riskBarChart")
    .getContext("2d");

  const pieCtx = document
    .getElementById("riskPieChart")
    .getContext("2d");

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Confidence"],
      datasets: [
        {
          label: "Risk Confidence %",
          data: [confidence],
          backgroundColor: confidence > 70
            ? "#dc3545"
            : confidence > 40
            ? "#ffc107"
            : "#28a745"
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
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
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"]
        }
      ]
    }
  });


  // ---------- Explanation ----------
  document.getElementById("explanation").innerText =
    data.llm_generated_explanation.summary;

  // ---------- Decision Trace ----------
  const traceList = document.getElementById("trace");
  traceList.innerHTML = "";
  data.decision_trace.forEach(step => {
    const li = document.createElement("li");
    li.innerText = step;
    traceList.appendChild(li);
  });

  // ---------- JSON ----------
  document.getElementById("jsonOutput").innerText =
    JSON.stringify(data, null, 2);
};
// Make result available to chatbot
setLastAnalysis(data);
lastAnalysisResult = data;

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
      lastAnalysisResult.pharmacogenomic_profile.primary_gene,
    risk_assessment: lastAnalysisResult.risk_assessment,
    clinical_recommendation:
      lastAnalysisResult.clinical_recommendation,
    explanation:
      lastAnalysisResult.llm_generated_explanation.summary,
    decision_trace: lastAnalysisResult.decision_trace
  };

  const blob = new Blob(
    [JSON.stringify(report, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PharmaGuard_Report_${lastAnalysisResult.drug}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
