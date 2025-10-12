import i18next from "../i18n";

export function langSwitcher() {
  const toggleBtn = document.getElementById("lang_toggle");
  const menu = document.getElementById("lang_menu");
  const currentLangLabel = document.getElementById("current_lang");

  if (!toggleBtn || !menu) return;

  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    i18next.changeLanguage(savedLang);
    currentLangLabel.textContent = savedLang.toUpperCase();
  }

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll("[data-lang-option]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedLang = e.target.dataset.langOption;
      i18next.changeLanguage(selectedLang);
      localStorage.setItem("language", selectedLang);
      currentLangLabel.textContent = selectedLang.toUpperCase();
      menu.classList.add("hidden");
      console.log("🌐 Language changed to", selectedLang);
    });
  });

  document.addEventListener("click", (e) => {
    if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });
}
