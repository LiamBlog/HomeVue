// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Website from './Website.vue';
import siteData from '../config/site.json';

describe('Website', () => {
  it('renders every configured site as a safe external link', () => {
    const wrapper = mount(Website);
    const links = wrapper.findAll('a.site-box');

    expect(links).toHaveLength(siteData.length);
    links.forEach((link, index) => {
      expect(link.attributes('href')).toBe(siteData[index].url);
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
      expect(link.text()).toContain(siteData[index].name);
    });
  });
});
