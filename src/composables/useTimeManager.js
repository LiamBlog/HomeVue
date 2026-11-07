import { computed, onMounted, onUnmounted, ref } from 'vue';

/**
 * 停留计时 + 当前日期时间：
 * - 每秒刷新一次当前时间，页面隐藏时暂停、恢复可见时校准；
 * - 卸载时清理定时器与事件监听。
 */
export function useTimeManager() {
  const startTime = ref(Date.now());
  const currentTime = ref(Date.now());
  let timer = null;

  const startTimer = () => {
    if (timer) return;
    timer = window.setInterval(() => {
      currentTime.value = Date.now();
    }, 1000);
  };

  const stopTimer = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopTimer();
      return;
    }
    currentTime.value = Date.now();
    startTimer();
  };

  onMounted(() => {
    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onUnmounted(() => {
    stopTimer();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  const timeUnits = computed(() => {
    const totalSeconds = Math.floor((currentTime.value - startTime.value) / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600).toString().padStart(2, '0'),
      minutes: Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0'),
      seconds: (totalSeconds % 60).toString().padStart(2, '0')
    };
  });

  const dateTime = computed(() => {
    const now = new Date(currentTime.value);
    return {
      dateOnly: now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      weekday: now.toLocaleDateString('zh-CN', { weekday: 'long' }),
      timeWithoutSeconds: now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  });

  return { timeUnits, dateTime };
}
