async function sendMessage() {
  const msg = document.getElementById("message").value;

  const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await response.json();
  document.getElementById("chat").innerHTML += `<p>${data.reply}</p>`;
}
