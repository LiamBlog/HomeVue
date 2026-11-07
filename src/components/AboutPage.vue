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
            href="https://github.com/LiamBlog/HomeVue"
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
const emit = defineEmits(['close']);

const techStack = [
  { name: 'Vue3', icon: 'fab fa-vuejs' },
  { name: 'Vite', icon: 'fas fa-bolt' },
  { name: 'CSS3', icon: 'fab fa-css3-alt' },
  { name: 'HTML5', icon: 'fab fa-html5' },
  { name: 'JavaScript', icon: 'fab fa-js' }
];
const closeModal = () => emit('close');
</script>

<style scoped>
.about-page {
  width: min(500px, 100%);
  max-height: calc(100dvh - 32px);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  background-color: rgba(var(--background-color-rgb), 0.66);
  box-shadow: var(--glass-edges), 0 24px 64px rgba(0, 0, 0, 0.25);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  position: relative;
  text-align: center;
  box-sizing: border-box;
  scrollbar-gutter: stable;
  animation: aboutIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: var(--glass-sheen);
    pointer-events: none;
  }

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
  color: var(--accent-bright);
}

.tech-stack li i,
.tech-item i {
  font-size: 1.5em;
}

@media (max-width: 600px) {
  .tech-stack li,
  .tech-item {
    flex: 0 0 calc((100% - 10px) / 3);
    font-size: 0.8em;
  }
}

.github-link {
  display: inline-block;
  background-color: var(--github-button-background);
  color: white;
  padding: 10px 20px;
  border: 1px solid var(--github-button-border);
  border-radius: var(--border-radius);
  text-decoration: none;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: var(--github-button-hover-background);
  }
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
}

@media (prefers-reduced-motion: reduce) {
  .about-page {
    animation: none;
  }

  .about-modal-content > div {
    animation: none;
    opacity: 1;
  }
}
</style>