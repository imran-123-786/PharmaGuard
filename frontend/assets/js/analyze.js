window.analyze = async function () {
  console.log("Run Analysis clicked");

  // 🔐 Safety: ensure user is logged in
  if (!localStorage.getItem("pharmaguard_logged_in")) {
    alert("Please login to run analysis");
    return;
  }

  const fileInput = document.getElementById("vcfFile");
  const file = fileInput.files[0];
  const drug = document.getElementById("drug").value;
  const language = document.getElementById("language").value;

  if (!file) {
    alert("Please upload a VCF file");
    return;
  }

  // 🧠 Update top cards immediately (UX polish)
  document.getElementById("drugInfo").innerText = drug;
  document.getElementById("geneInfo").innerText = "Analyzing...";
  document.getElementById("riskInfo").innerText = "Analyzing...";
  document.getElementById("confidenceInfo").innerText = "—";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("drug", drug);
  formData.append("language", language);

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Backend returned error");
    }

    const data = await response.json();
    console.log("Backend response:", data);

    // ✅ Render result safely
    showResult(data);

  } catch (error) {
    console.error("Analysis failed:", error);

    alert(
      "Analysis could not be completed. Please ensure the backend server is running."
    );

    // Reset cards on failure
    document.getElementById("geneInfo").innerText = "—";
    document.getElementById("riskInfo").innerText = "—";
    document.getElementById("confidenceInfo").innerText = "—";
  }
};
