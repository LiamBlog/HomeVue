// @vitest-environment jsdom
import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Home from './Home.vue';

const { typedDestroy } = vi.hoisted(() => ({ typedDestroy: vi.fn() }));
vi.mock('typed.js', () => ({
  default: vi.fn(function MockTyped() {
    this.destroy = typedDestroy;
  }),
}));
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
    global: {
      directives: {
        'motion-pop': {},
        'motion-slide-left': {},
      },
    },
  });
};

describe('Home interactions', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-mode');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    typedDestroy.mockClear();
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

  it('destroys Typed.js when unmounted', () => {
    const wrapper = mountHome();
    wrapper.unmount();
    expect(typedDestroy).toHaveBeenCalledOnce();
  });
});
