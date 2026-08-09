<template>
  <div class="container">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div v-for="(siteChunk, index) in chunkedSites" :key="index" class="swiper-slide">
          <div class="site-grid">
            <a v-for="(site, i) in siteChunk" :key="i" class="site-box" :href="site.url" target="_blank" rel="noopener noreferrer">
              <span class="site-content">
                <i :class="site.icon" aria-hidden="true"></i>
                <span class="site-name">{{ site.name }}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import siteData from '../config/site.json';

const chunkedSites = ref(siteData.reduce((acc, site, index) => {
  const chunkIndex = Math.floor(index / 6);
  if (!acc[chunkIndex]) acc[chunkIndex] = [];
  acc[chunkIndex].push(site);
  return acc;
}, []));

onMounted(() => {
  new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: { el: '.swiper-pagination', clickable: true },
    mousewheel: { releaseOnEdges: true },
  });
});
</script>


<style scoped>
.container {
  max-width: 700px;
  width: 100%;
  margin: 30px 0 20px;
}

.swiper-container {
  overflow: hidden;
  padding: 10px;
}

.swiper-pagination {
  bottom: inherit;
}

.site-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.site-box {
  min-width: 0;
  padding: 30px;
  color: var(--text-color);
  text-decoration: none;
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  background-color: rgba(var(--background-color-rgb), 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:focus-visible {
    outline: 2px solid var(--hover-link-color);
    outline-offset: 2px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 1px 8px var(--shadow-color);
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
  }
}

.site-name {
  min-width: 0;
  margin: 0;
  font-size: 1.17em;
  font-weight: bold;
  text-align: center;
  overflow-wrap: anywhere;
}

@media screen and (max-width: 768px) {
  .site-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .site-content {
    gap: 5px;
    flex-direction: column;
  }

  .site-box {
    padding: 15px;
    border-radius: 8px;
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
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .site-content {
    flex-direction: row;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-box {
    transition: none;
  }
}

:deep(.swiper-pagination-bullet-active) {
  background: #8c8c8c94;
  width: 20px;
  border-radius: 5px;
}
</style>
