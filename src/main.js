import { createApp } from 'vue';
import App from './App.vue';
import './style.less';
import './styles/icons.less';

const app = createApp(App);

app.mount('#app');

// 统计脚本：仅在配置了站点地址与 ID 时加载，便于本地开发或未配置环境时跳过
const umamiSrc = import.meta.env.VITE_APP_UMAMI_SRC;
const umamiWebsiteId = import.meta.env.VITE_APP_UMAMI_WEBSITE_ID;

if (umamiSrc && umamiWebsiteId) {
  const script = document.createElement('script');
  script.defer = true;
  script.src = umamiSrc;
  script.dataset.websiteId = umamiWebsiteId;
  document.head.appendChild(script);
}

// PWA：仅生产环境注册 Service Worker，支持离线访问
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
