// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTypewriter } from './useTypewriter';

const createTarget = () => {
  const element = document.createElement('p');
  return { value: element };
};

afterEach(() => {
  vi.useRealTimers();
});

describe('useTypewriter', () => {
  it('types, holds and deletes before moving to the next string', () => {
    vi.useFakeTimers();
    const target = createTarget();
    useTypewriter(target, ['ab', 'cd'], { typeSpeed: 100, backSpeed: 50, holdDuration: 500 });

    expect(target.value.textContent).toBe('');

    vi.advanceTimersByTime(100);
    expect(target.value.textContent).toBe('a');
    vi.advanceTimersByTime(100);
    expect(target.value.textContent).toBe('ab');

    vi.advanceTimersByTime(500);
    expect(target.value.textContent).toBe('a');
    vi.advanceTimersByTime(50);
    expect(target.value.textContent).toBe('');

    vi.advanceTimersByTime(100);
    expect(target.value.textContent).toBe('c');
  });

  it('stops all pending timers when stopped', () => {
    vi.useFakeTimers();
    const target = createTarget();
    const { stop } = useTypewriter(target, ['hello'], { typeSpeed: 100 });

    expect(vi.getTimerCount()).toBe(1);
    stop();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does nothing when the string list is empty', () => {
    vi.useFakeTimers();
    const target = createTarget();
    useTypewriter(target, []);

    expect(vi.getTimerCount()).toBe(0);
    expect(target.value.textContent).toBe('');
  });
});
