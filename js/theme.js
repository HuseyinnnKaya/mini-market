const THEME_STORAGE_KEY = "mini-market-theme";

function applyTheme(isDarkMode) {
  const themeToggle = document.getElementById("theme-toggle");

  if (!themeToggle) {
    throw new Error("#theme-toggle butonu bulunamadı.");
  }

  document.body.classList.toggle("dark-mode", isDarkMode);
  themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDarkMode ? "Açık temaya geç" : "Koyu temaya geç"
  );
}

function initializeTheme() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) === "dark");
}

function toggleTheme() {
  const isDarkMode = !document.body.classList.contains("dark-mode");
  applyTheme(isDarkMode);
  localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
}

globalThis.applyTheme = applyTheme;
globalThis.initializeTheme = initializeTheme;
globalThis.toggleTheme = toggleTheme;
