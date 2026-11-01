import { createApp } from 'vue';
import App from './App.vue';
import './style.less';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import { MotionPlugin } from '@vueuse/motion';

const app = createApp(App);

app.use(MotionPlugin);

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
