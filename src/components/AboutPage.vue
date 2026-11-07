<template>
  <div
    class="about-page"
    @click.stop
  >
    <div class="about-modal">
      <div class="about-modal-content">
        <div class="tech-stack">
          <h3>使用的技术栈</h3>
          <ul class="tech-list">
            <li
              v-for="tech in techStack"
              :key="tech.name"
              :class="['tech-item', tech.name.toLowerCase()]"
            >
              <i
                :class="tech.icon"
                aria-hidden="true"
              />
              {{ tech.name }}
            </li>
          </ul>
        </div>
        <div class="github-info">
          <h3>开源地址</h3>
          <a
            href="https://github.com/JLinMr/Home-Vue"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
          >
            <i
              class="fab fa-github"
              aria-hidden="true"
            /> Github
          </a>
        </div>
        <div class="update-info">
          <h3>最近更新</h3>
          <ul class="update-list">
            <li
              v-if="loading"
              class="loading-item"
              role="status"
              aria-label="正在加载更新信息"
            >
              <div class="loading-spinner" />
            </li>
            <li
              v-else-if="loadError"
              class="update-error"
              role="alert"
            >
              <span>{{ loadError }}</span>
              <button
                type="button"
                class="retry-btn"
                @click="fetchCommits"
              >
                重试
              </button>
            </li>
            <li
              v-else-if="!lastUpdates.length"
              class="update-empty"
            >
              暂无更新记录
            </li>
            <template v-else>
              <li
                v-for="update in lastUpdates"
                :key="update.id"
                class="update-item"
              >
                {{ update.message }} <span v-if="update.date"> ({{ update.date }})</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <button
        type="button"
        class="close-btn"
        aria-label="关闭关于窗口"
        @click="closeModal"
      >
        <i
          class="fas fa-times"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

const techStack = [
  { name: 'Vue3', icon: 'fab fa-vuejs' },
  { name: 'Vite', icon: 'fas fa-bolt' },
  { name: 'CSS3', icon: 'fab fa-css3-alt' },
  { name: 'HTML5', icon: 'fab fa-html5' },
  { name: 'JavaScript', icon: 'fab fa-js' }
];
const lastUpdates = ref([]);
const loading = ref(true);
const loadError = ref('');
const closeModal = () => emit('close');

const GITHUB_COMMITS_URL = 'https://api.github.com/repos/JLinMr/Home-Vue/commits';
const REQUEST_TIMEOUT = 8000;

const resolveErrorMessage = (error, response) => {
  if (navigator.onLine === false) return '当前网络不可用，请检查网络后重试';
  if (error?.name === 'AbortError') return '请求超时，请稍后重试';

  const status = response?.status;
  if (status === 403 || status === 429) return 'GitHub 接口访问次数受限，请稍后重试';
  if (status >= 500) return 'GitHub 服务暂时不可用，请稍后重试';
  return '无法获取更新信息，请稍后重试';
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('zh-CN');
};

const fetchCommits = async () => {
  loading.value = true;
  loadError.value = '';

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  let response;

  try {
    response = await fetch(GITHUB_COMMITS_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const commits = await response.json();
    if (!Array.isArray(commits)) throw new Error('Unexpected GitHub API response');

    lastUpdates.value = commits.slice(0, 3).map((commit, index) => ({
      id: commit.sha || `commit-${index}`,
      message: commit.commit?.message?.split('\n')[0] || '无提交说明',
      date: formatDate(commit.commit?.author?.date)
    }));
  } catch (error) {
    console.error('获取更新信息失败', error);
    lastUpdates.value = [];
    loadError.value = resolveErrorMessage(error, response);
  } finally {
    window.clearTimeout(timeoutId);
    loading.value = false;
  }
};

fetchCommits();
</script>

<style scoped>
.about-page {
  width: min(500px, 100%);
  max-height: calc(100dvh - 32px);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  backdrop-filter: blur(5px);
  background-color: rgba(var(--background-color-rgb), 0.9);
  padding: 40px;
  border-radius: var(--border-radius);
  position: relative;
  text-align: center;
  box-sizing: border-box;
  scrollbar-gutter: stable;
  animation: aboutIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 600px) {
    max-height: calc(100dvh - 24px);
    padding: 24px 20px 20px;
    margin: auto;
  }
}

h3 {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 10px;
}

.tech-stack ul,
.tech-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.tech-stack li,
.tech-item {
  padding: 10px 15px;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  display: flex;
  gap: 5px;
  flex-direction: column;
}

.tech-stack li:hover,
.tech-item:hover {
  background-color: var(--hover-other-color);
  color: var(--hover-link-color);
}

.tech-stack li i,
.tech-item i {
  font-size: 1.5em;
}

@media (max-width: 600px) {
  .tech-stack li,
  .tech-item {
    font-size: 0.8em;
  }
}

.github-link {
  display: inline-block;
  background-color: #040404d0;
  color: white;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1a1a1a;
  }
}

.update-info ul,
.update-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 73px;
  justify-content: center;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  font-size: 1.5em;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease, background-color 0.3s ease;

  &:focus-visible {
    outline: none;
    color: #c61b09;
    background-color: rgba(var(--background-color-rgb), 0.5);
  }

  @media (hover: hover) {
    &:hover {
      color: #c61b09;
      background-color: rgba(var(--background-color-rgb), 0.5);
    }
  }
}

.loading-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-top-color: #ffcc00;
  animation: spin 1s ease-in-out infinite;
}

.update-error {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #c0392b;
  text-align: center;
  overflow-wrap: anywhere;
}

:global(.dark-mode) .update-error {
  color: #ff8a80;
}

.retry-btn {
  padding: 4px 14px;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:focus-visible {
    outline: 2px solid var(--hover-link-color);
    outline-offset: 2px;
  }

  @media (hover: hover) {
    &:hover {
      background-color: currentColor;
      color: var(--background-color);
    }
  }
}

.update-empty {
  color: #7f8c8d;
  font-style: italic;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes aboutIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.about-modal-content > div {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  opacity: 0;

  &:nth-child(1) { animation-delay: 0.12s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.28s; }
}

.update-item {
  width: 100%;
  min-width: 0;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (prefers-reduced-motion: reduce) {
  .about-page {
    animation: none;
  }

  .loading-spinner {
    animation: none;
  }

  .about-modal-content > div {
    animation: none;
    opacity: 1;
  }
}
</style>