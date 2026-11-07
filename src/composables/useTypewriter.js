/**
 * 轻量打字机效果：逐字输入、停留、逐字删除并循环。
 * 光标由 CSS 伪元素绘制，不在 DOM 中额外插入节点。
 */
export function useTypewriter(targetRef, strings, options = {}) {
  const {
    typeSpeed = 120,
    backSpeed = 80,
    holdDuration = 1500,
  } = options;

  let timer = null;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const render = (value) => {
    if (targetRef.value) targetRef.value.textContent = value;
  };

  const tick = () => {
    const text = strings[textIndex] ?? '';

    if (isDeleting) {
      charIndex -= 1;
      render(text.slice(0, charIndex));

      if (charIndex <= 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % strings.length;
        timer = window.setTimeout(tick, typeSpeed);
        return;
      }
      timer = window.setTimeout(tick, backSpeed);
      return;
    }

    charIndex += 1;
    render(text.slice(0, charIndex));

    if (charIndex >= text.length) {
      isDeleting = true;
      timer = window.setTimeout(tick, holdDuration);
      return;
    }
    timer = window.setTimeout(tick, typeSpeed);
  };

  if (strings?.length) {
    render('');
    timer = window.setTimeout(tick, typeSpeed);
  }

  const stop = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  return { stop };
}
