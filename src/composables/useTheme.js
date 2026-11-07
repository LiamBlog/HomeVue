import { computed, ref } from 'vue';

const STORAGE_KEY = 'darkMode';

const systemPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)');

/**
 * 主题管理：首次加载优先使用本地存储，其次跟随系统偏好；切换时持久化。
 * 未手动设置过主题时，系统切换深浅色会实时跟随。
 */
export function useTheme() {
  const isDarkMode = ref(false);
  const darkModeIconClass = computed(() => (isDarkMode.value ? 'fas fa-sun' : 'fas fa-moon'));

  const applyDarkMode = (enabled) => {
    isDarkMode.value = enabled;
    document.documentElement.classList.toggle('dark-mode', enabled);
  };

  const readSavedDarkMode = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      // 存储不可用时回退到系统偏好
      return null;
    }
  };

  const initializeTheme = () => {
    const savedDarkMode = readSavedDarkMode();
    applyDarkMode(savedDarkMode === null ? systemPrefersDark().matches : savedDarkMode === 'true');

    // 用户未手动设置过主题时，跟随系统深浅色切换
    if (savedDarkMode === null) {
      systemPrefersDark().addEventListener('change', (event) => {
        if (readSavedDarkMode() === null) applyDarkMode(event.matches);
      });
    }
  };

  const toggleDarkMode = () => {
    const enabled = !isDarkMode.value;
    applyDarkMode(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      // 存储不可用时仅在本次会话生效
    }
  };

  return { isDarkMode, darkModeIconClass, initializeTheme, toggleDarkMode };
}
