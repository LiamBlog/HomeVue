// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AboutPage from './AboutPage.vue';

const okResponse = (commits) => ({
  ok: true,
  status: 200,
  json: async () => commits,
});

const errorResponse = (status) => ({ ok: false, status });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('AboutPage commit loading', () => {
  it('renders the latest commit summary', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([{
      sha: 'abc123',
      commit: { message: 'Add feature\nDetails', author: { date: '2025-01-01T00:00:00Z' } },
    }])));
    const wrapper = mount(AboutPage);
    await flushPromises();

    expect(wrapper.text()).toContain('Add feature');
    expect(wrapper.text()).not.toContain('Details');
    expect(wrapper.find('.loading-item').exists()).toBe(false);
  });

  it('reports server errors separately and offers retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(503)));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(AboutPage);
    await flushPromises();

    expect(wrapper.text()).toContain('GitHub 服务暂时不可用');
    expect(wrapper.find('.update-error').attributes('role')).toBe('alert');
    expect(wrapper.find('.retry-btn').exists()).toBe(true);
    expect(wrapper.find('.loading-item').exists()).toBe(false);
  });

  it('explains rate limiting when GitHub returns 403', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(403)));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(AboutPage);
    await flushPromises();

    expect(wrapper.text()).toContain('访问次数受限');
  });

  it('reports timeouts instead of a generic failure', async () => {
    const abortError = Object.assign(new Error('aborted'), { name: 'AbortError' });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(AboutPage);
    await flushPromises();

    expect(wrapper.text()).toContain('请求超时');
  });

  it('recovers after a retry succeeds', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(errorResponse(500))
      .mockResolvedValueOnce(okResponse([{
        sha: 'def456',
        commit: { message: 'Fix retry', author: { date: '2025-02-02T00:00:00Z' } },
      }]));
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(AboutPage);
    await flushPromises();
    expect(wrapper.find('.update-error').exists()).toBe(true);

    await wrapper.get('.retry-btn').trigger('click');
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain('Fix retry');
    expect(wrapper.find('.update-error').exists()).toBe(false);
  });

  it('shows an empty state when the repository has no commits', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([])));
    const wrapper = mount(AboutPage);
    await flushPromises();

    expect(wrapper.text()).toContain('暂无更新记录');
  });
});
