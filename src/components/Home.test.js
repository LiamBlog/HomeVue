// @vitest-environment jsdom
import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Home from './Home.vue';

vi.mock('./Website.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./VisitTimer.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./AboutPage.vue', () => ({
  default: {
    emits: ['close'],
    template: '<button class="close-about" @click="$emit(\'close\')">close</button>',
  },
}));

let wrapper;

afterEach(() => {
  wrapper?.unmount();
});

const mountHome = () => {
  return wrapper = mount(Home, {
    attachTo: document.body,
  });
};

describe('Home interactions', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-mode');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
  });

  it('initializes theme from system preference and persists toggles', async () => {
    window.matchMedia.mockReturnValue({ matches: true });
    const wrapper = mountHome();
    await flushPromises();

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    await wrapper.get('[aria-label="切换到浅色模式"]').trigger('click');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('false');
  });

  it('prefers the saved theme over the system preference', async () => {
    localStorage.setItem('darkMode', 'false');
    window.matchMedia.mockReturnValue({ matches: true });
    mountHome();
    await flushPromises();

    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });

  it('closes the about dialog on Escape and restores focus', async () => {
    const wrapper = mountHome();
    const trigger = wrapper.get('.profile-button');
    trigger.element.focus();
    await trigger.trigger('click');
    await flushPromises();

    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('关于');
    expect(document.activeElement).toBe(wrapper.get('[role="dialog"]').element);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await flushPromises();

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    expect(document.activeElement).toBe(trigger.element);
  });

  it('stops the typewriter timers when unmounted', () => {
    vi.useFakeTimers();
    const wrapper = mountHome();

    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });

  it('shows the first description without typing when reduced motion is preferred', () => {
    window.matchMedia.mockReturnValue({ matches: true });
    const wrapper = mountHome();

    expect(wrapper.get('.description p').text()).toBe('你好鸭，欢迎来到我的主页！！');
  });
});
