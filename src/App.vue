<template>
  <div class="app-container">
    <div class="background"></div>
    <main class="main-content">
      <Home />
    </main>
    <footer>
      <div class="footer-content">
        <span class="footer-item">© 2025 Made in <a href="https://mlhh.cn" target="_blank">十安</a></span>
        <span class="footer-separator">|</span>
        <a href="https://icp.gov.moe/?keyword=20240301" target="_blank">萌ICP备20240301号</a>
        <span class="footer-separator">|</span>
        <a class="footer-item" href="https://cloud.tencent.com/act/pro/eo-freeplan?ad_trace=3fe11a4b31634407819b427b61a2b768&from=28455&from-column=28455" target="_blank">腾讯云边缘安全加速EdgeOne</a>
        <span class="footer-text">(国内)提供强劲加速</span>
        <span class="footer-separator">|</span>
        <a class="footer-item" href="https://beian.miit.gov.cn/" target="_blank">{{ icpNumber }}</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Home from './components/Home.vue';

// 环境变量引用
const userName = ref(import.meta.env.VITE_APP_USER_NAME || '十安');
const icpNumber = ref(import.meta.env.VITE_APP_ICP_NUMBER || '豫ICP备2024077903号-3');
const policenumber = ref(import.meta.env.VITE_APP_POLICE_NUMBER);
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-gutter: stable;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(128, 128, 128, 0.4) transparent;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.4);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .main-content {
    scroll-behavior: auto;
  }
}

/* 大屏 / iPad 横屏：增加侧边留白，避免内容贴边 */
@media (min-width: 1024px) {
  .main-content {
    padding-inline: 24px;
  }
}

/* iPad 竖屏 / 折叠屏展开态 */
@media (min-width: 768px) and (max-width: 1024px) {
  .main-content {
    padding-inline: 16px;
  }
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* 确保背景不会阻止滚动 */
  pointer-events: none;
  transition: background-color 0.35s ease;
}

footer {
  text-align: center;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)); /* iOS安全区域 */
  font-size: 0.9rem;
  color: var(--text-color);
  margin-top: auto;
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  /* 确保footer不会阻止内容滚动 */
  position: relative;
  z-index: 1;
  transition: color 0.35s ease;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 1200px;
  margin: 0 auto;
}

footer a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
  white-space: nowrap;
}

footer a:hover {
  text-decoration: underline;
  color: var(--link-hover-color, #42b983);
}

.footer-item {
  white-space: nowrap;
}

.footer-text {
  white-space: nowrap;
}

.footer-separator {
  color: rgba(255, 255, 255, 0.5);
  margin: 0 4px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  footer {
    font-size: 0.8rem;
    padding: 15px 10px;
    padding-bottom: calc(15px + env(safe-area-inset-bottom, 0px)); /* iOS安全区域 */
    line-height: 1.6;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 6px;
  }
  
  .footer-separator {
    display: none;
  }
  
  .footer-item, .footer-text {
    white-space: normal;
    text-align: center;
    line-height: 1.4;
  }
  
  footer a {
    display: inline-block;
    max-width: 100%;
    padding: 2px 0;
    white-space: normal;
    overflow-wrap: anywhere;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 480px) {
  footer {
    font-size: 0.75rem;
    padding: 12px 8px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); /* iOS安全区域 */
  }
  
  .footer-content {
    gap: 4px;
  }
  
  .footer-item, .footer-text {
    line-height: 1.3;
  }
}

/* 横屏模式适配 */
@media screen and (max-width: 768px) and (orientation: landscape) {
  footer {
    padding: 12px 10px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); /* iOS安全区域 */
  }
  
  .footer-content {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .footer-separator {
    display: inline;
  }
}

@supports (height: 100dvh) {
  .app-container {
    height: 100dvh;
  }
}
</style>
