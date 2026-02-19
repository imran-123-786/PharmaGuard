async function analyze() {
  const file = document.getElementById("vcfFile").files[0];
  const drug = document.getElementById("drug").value;
  const language = document.getElementById("language").value;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("drug", drug);
  formData.append("language", language);

  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  showResult(data);
}
