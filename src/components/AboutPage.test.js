// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AboutPage from './AboutPage.vue';

describe('AboutPage', () => {
  it('renders the tech stack and the repository link', () => {
    const wrapper = mount(AboutPage);

    expect(wrapper.text()).toContain('使用的技术栈');
    expect(wrapper.findAll('.tech-item')).toHaveLength(5);
    expect(wrapper.get('.github-link').attributes('href')).toBe('https://github.com/LiamBlog/HomeVue');
  });

  it('emits close when the close button is clicked', async () => {
    const wrapper = mount(AboutPage);

    await wrapper.get('.close-btn').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});
