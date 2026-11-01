import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const FOCUSABLE_SELECTOR = 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * 弹窗焦点管理：打开时聚焦弹窗、Tab 在弹窗内循环、Esc 触发关闭、关闭后恢复原焦点。
 *
 * @param {() => HTMLElement | null} getActiveDialog 返回当前可见弹窗的根元素
 * @param {() => void} onEscape 按下 Esc 时的关闭逻辑
 */
export function useDialogFocus(getActiveDialog, onEscape) {
  const lastFocusedElement = ref(null);

  const rememberFocus = () => {
    lastFocusedElement.value = document.activeElement;
  };

  const restoreFocus = () => {
    lastFocusedElement.value?.focus?.();
    lastFocusedElement.value = null;
  };

  const focusDialog = async (dialogRef) => {
    await nextTick();
    dialogRef.value?.focus();
  };

  const handleKeydown = (event) => {
    const dialog = getActiveDialog();
    if (!dialog) return;

    if (event.key === 'Escape') {
      onEscape();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)];
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  onMounted(() => window.addEventListener('keydown', handleKeydown));
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

  return { rememberFocus, restoreFocus, focusDialog };
}
