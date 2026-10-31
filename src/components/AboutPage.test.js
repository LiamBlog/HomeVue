// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AboutPage from './AboutPage.vue';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AboutPage commit loading', () => {
  it('renders the latest commit summary', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{
        sha: 'abc123',
        commit: { message: 'Add feature\nDetails', author: { date: '2025-01-01T00:00:00Z' } },
      }],
    }));
    const wrapper = mount(AboutPage);
    await flushPromises();

    expect(wrapper.text()).toContain('Add feature');
    expect(wrapper.text()).not.toContain('Details');
    expect(wrapper.find('.loading-item').exists()).toBe(false);
  });

  it('shows an error state when the API returns a failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(AboutPage);
    await flushPromises();

    expect(wrapper.text()).toContain('无法获取更新信息');
    expect(wrapper.find('.loading-item').exists()).toBe(false);
  });
});
