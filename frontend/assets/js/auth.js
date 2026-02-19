// 🔐 Demo credentials
const DEMO_EMAIL = "demo@pharmaguard.ai";
const DEMO_PASSWORD = "pharmaguard123";

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem("pharmaguard_logged_in", "true");
    localStorage.setItem("pharmaguard_user", email);
    showDashboard();
  } else {
    alert("Invalid email or password");
  }
}

function logout() {
  localStorage.removeItem("pharmaguard_logged_in");
  localStorage.removeItem("pharmaguard_user");
  showLogin();
}

function showDashboard() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
}

function showLogin() {
  document.getElementById("loginSection").style.display = "flex";
  document.getElementById("dashboardSection").style.display = "none";
}

// Auto-check login on page load
window.onload = function () {
  if (localStorage.getItem("pharmaguard_logged_in")) {
    showDashboard();
  } else {
    showLogin();
  }
};
