export const initScript = `
  (function() {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
    
    // Language initialization - set a data attribute for initial render
    const savedLang = localStorage.getItem('language');
    const lang = savedLang || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');
    document.documentElement.setAttribute('data-lang', lang);
  })();
`;
