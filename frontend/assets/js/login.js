function login() {
  // Save login flag
  localStorage.setItem("pharmaguard_logged_in", "true");

  console.log("Login successful");

  // Redirect to dashboard
  window.location.href = "index.html";
}
