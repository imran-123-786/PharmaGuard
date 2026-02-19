// ✅ Make analyze GLOBAL so button onclick can find it
window.analyze = async function () {
  console.log("✅ Run Analysis clicked");

  // Get DOM elements safely
  const fileInput = document.getElementById("vcfFile");
  const drugInput = document.getElementById("drug");
  const languageInput = document.getElementById("language");

  // Safety checks
  if (!fileInput || !drugInput || !languageInput) {
    console.error("❌ Input elements not found in DOM");
    alert("UI error: input fields missing");
    return;
  }

  const file = fileInput.files[0];
  const drug = drugInput.value;
  const language = languageInput.value;

  console.log("📄 File:", file);
  console.log("💊 Drug:", drug);
  console.log("🌍 Language:", language);

  if (!file) {
    alert("Please upload a VCF file");
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("drug", drug);
  formData.append("language", language);

  try {
    console.log("🚀 Sending request to backend...");

    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Backend error: " + response.status);
    }

    const data = await response.json();
    console.log("✅ Backend response received:", data);

    // Call visualization
    showResult(data);

  } catch (error) {
    console.error("❌ Error during analysis:", error);
    alert("Analysis failed. Check backend server.");
  }
};
