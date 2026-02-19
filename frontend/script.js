async function analyze() {
  const file = document.getElementById("vcfFile").files[0];
  const drug = document.getElementById("drug").value;
  const language = document.getElementById("language").value;

  if (!file) {
    alert("Please upload a VCF file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("drug", drug);
  formData.append("language", language);

  const res = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  displayResult(data);
}

function displayResult(data) {
  document.getElementById("resultCard").style.display = "block";

  const confidence = Math.round(
    data.risk_assessment.confidence_score * 100
  );

  let riskClass = "safe";
  if (confidence > 70) riskClass = "danger";
  else if (confidence > 40) riskClass = "warning";

  const riskBox = document.getElementById("riskBox");
  riskBox.className = `risk-box ${riskClass}`;

  document.getElementById("riskLabel").innerText =
    data.risk_assessment.risk_label;

  document.getElementById("riskPercent").innerText =
    Risk % + "% risk percentage";

  document.getElementById("explanation").innerText =
    data.llm_generated_explanation.summary;

  const traceList = document.getElementById("trace");
  traceList.innerHTML = "";
  data.decision_trace.forEach(step => {
    const li = document.createElement("li");
    li.innerText = step;
    traceList.appendChild(li);
  });

  document.getElementById("jsonOutput").innerText =
    JSON.stringify(data, null, 2);
}
async function analyze() {
  const file = document.getElementById("vcfFile").files[0];
  const drug = document.getElementById("drug").value;
  const language = document.getElementById("language").value;

  if (!file) {
    alert("Please upload a VCF file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("drug", drug);
  formData.append("language", language);

  const res = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  showResult(data);
}

function showResult(data) {
  document.getElementById("resultPanel").classList.remove("hidden");

  const confidence = Math.round(
    data.risk_assessment.confidence_score * 100
  );

  let riskClass = "safe";
  if (confidence > 70) riskClass = "danger";
  else if (confidence > 40) riskClass = "warning";

  const riskBox = document.getElementById("riskBox");
  riskBox.className = `risk-box ${riskClass}`;

  document.getElementById("riskLabel").innerText =
    data.risk_assessment.risk_label;

  document.getElementById("riskPercent").innerText =
    confidence + "% confidence";

  document.getElementById("explanation").innerText =
    data.llm_generated_explanation.summary;

  document.getElementById("geneInfo").innerText =
    data.pharmacogenomic_profile.primary_gene;

  document.getElementById("drugInfo").innerText =
    data.drug;

  document.getElementById("riskInfo").innerText =
    data.risk_assessment.risk_label;

  document.getElementById("confidenceInfo").innerText =
    confidence + "%";

  const traceList = document.getElementById("trace");
  traceList.innerHTML = "";
  data.decision_trace.forEach(step => {
    const li = document.createElement("li");
    li.innerText = step;
    traceList.appendChild(li);
  });

  document.getElementById("jsonOutput").innerText =
    JSON.stringify(data, null, 2);
}
