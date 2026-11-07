<template>
  <div class="container">
    <div class="site-grid">
      <a
        v-for="site in siteData"
        :key="site.url"
        class="site-box"
        :href="site.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="site-content">
          <i
            :class="site.icon"
            aria-hidden="true"
          />
          <span class="site-name">{{ site.name }}</span>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup>
import siteData from '../config/site.json';
</script>


<style scoped>
.container {
  max-width: 700px;
  width: 100%;
  margin: 30px 0 20px;
}

.site-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.site-box {
  flex: 0 1 calc((100% - 30px) / 3);
  min-width: 0;
  padding: 30px;
  color: var(--text-color);
  text-decoration: none;
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background-color: var(--surface-color);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;

  &:active {
    transform: translateY(-1px) scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid var(--hover-link-color);
    outline-offset: 2px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: inset 0 1px 0 var(--glass-highlight), 0 12px 28px var(--shadow-color);
      border-color: var(--hover-link-color);
      background-color: var(--surface-color-hover);

      .site-content i,
      .site-name {
        color: var(--hover-link-color);
      }

      .site-content i {
        transform: scale(1.08);
      }
    }
  }
}

.site-content {
  display: flex;
  min-width: 0;
  gap: 10px;
  justify-content: center;
  align-items: center;

  i {
    font-size: var(--icon-size);
    color: var(--text-color);
    transition: color 0.3s ease, transform 0.3s ease;
  }
}

.site-name {
  min-width: 0;
  margin: 0;
  font-size: 1.17em;
  font-weight: bold;
  text-align: center;
  color: var(--text-color);
  overflow-wrap: anywhere;
  transition: color 0.3s ease;
}

@media screen and (max-width: 768px) {
  .site-box {
    flex-basis: calc((100% - 15px) / 2);
  }
  .site-content {
    gap: 5px;
    flex-direction: column;
  }

  .site-box {
    padding: 15px;
    border-radius: 12px;
  }

  .site-name {
    font-size: 16px;
  }

  .site-content i {
    font-size: 18px;
  }
}

@media screen and (max-width: 420px) {
  .container {
    margin-top: 20px;
  }

  .site-grid {
    gap: 10px;
  }

  .site-box {
    flex-basis: 100%;
  }

  .site-content {
    flex-direction: row;
  }
}

/* iPad 竖屏 / 折叠屏展开态：保持三列，微调容器与间距 */
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    margin: 24px 0 16px;
  }

  .site-grid {
    gap: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-box {
    transition: none;
  }
}
</style>
