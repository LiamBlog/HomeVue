// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import VisitTimer from './VisitTimer.vue';

const mountTimer = () => mount(VisitTimer, {
  global: {
    directives: { motion: {} },
  },
});

afterEach(() => {
  vi.useRealTimers();
});

describe('VisitTimer', () => {
  it('opens the calendar on click and closes it on Escape', async () => {
    vi.useFakeTimers();
    const wrapper = mountTimer();

    await wrapper.get('.visit-timer').trigger('click');
    expect(wrapper.get('.visit-timer').attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('#calendar-popup').exists()).toBe(true);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#calendar-popup').exists()).toBe(false);
    expect(wrapper.get('.visit-timer').attributes('aria-expanded')).toBe('false');
  });

  it('clears its interval when unmounted', () => {
    vi.useFakeTimers();
    const wrapper = mountTimer();

    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
