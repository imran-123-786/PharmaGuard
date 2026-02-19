window.analyze = async function () {
  console.log("Run Analysis clicked");

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

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    console.log("Backend response:", data);

    // ❌ REMOVE ANY FAILURE POPUP
    // ✅ Always render result
    showResult(data);

  } catch (error) {
    console.error("Fetch error:", error);
    alert("Frontend fetch error");
  }
};
