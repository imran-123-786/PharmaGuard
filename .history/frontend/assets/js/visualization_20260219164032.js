window.showResult = function (data) {
  console.log("Rendering result", data);

  const panel = document.getElementById("resultPanel");
  if (!panel) {
    console.error("resultPanel not found in HTML");
    return;
  }

  panel.classList.remove("hidden");

  let risk = data.risk_assessment.risk_label;
  let confidence = Math.round(
    data.risk_assessment.confidence_score * 100
  );

  let colorClass = "safe";
  if (confidence > 70) colorClass = "danger";
  else if (confidence > 40) colorClass = "warning";

  panel.innerHTML = `
    <h3 class="${colorClass}">Risk: ${risk}</h3>
    <p>Confidence: ${confidence}%</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  `;
};
