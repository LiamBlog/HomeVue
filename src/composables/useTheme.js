import { computed, ref } from 'vue';

const STORAGE_KEY = 'darkMode';

/**
 * 主题管理：首次加载优先使用本地存储，其次跟随系统偏好；切换时持久化。
 */
export function useTheme() {
  const isDarkMode = ref(false);
  const darkModeIconClass = computed(() => (isDarkMode.value ? 'fas fa-sun' : 'fas fa-moon'));

  const applyDarkMode = (enabled) => {
    isDarkMode.value = enabled;
    document.documentElement.classList.toggle('dark-mode', enabled);
  };

  const initializeTheme = () => {
    let savedDarkMode = null;
    try {
      savedDarkMode = localStorage.getItem(STORAGE_KEY);
    } catch {
      // 存储不可用时回退到系统偏好
    }

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyDarkMode(savedDarkMode === null ? prefersDarkMode : savedDarkMode === 'true');
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
