<template>
  <div class="content">
    <div class="user-profile-container">
      <div class="user-profile-image" v-motion-pop>
        <button ref="profileButton" type="button" class="profile-button" aria-label="打开关于窗口" @click="toggleInfo">
          <img :src="profileImage" alt="" referrerpolicy="no-referrer">
        </button>
        <span class="status-ball"></span>
      </div>
      <div class="user-name" v-motion-slide-left>
        <h1>Hi,</h1>
        <h1>I'm <span class="name-style">{{ userName }}</span></h1>
      </div>
    </div>
    <div class="description">
      <p ref="descriptionElement"></p>
    </div>
    <div class="contact-section" v-motion-pop>
      <template v-for="contact in contacts" :key="contact.type">
        <a v-if="contact.url" :href="contact.url" target="_blank" rel="noopener noreferrer" class="contact-item" :style="{ '--hover-color': contact.hoverColor }">
          <i :class="contact.icon"></i>
          <span class="tooltip">{{ contact.type }}</span>
        </a>
        <button v-else type="button" @click="toggleQRCode(contact.qrCode)" class="contact-item" :style="{ '--hover-color': contact.hoverColor }" :aria-label="contact.type">
          <i :class="contact.icon"></i>
          <span class="tooltip">{{ contact.type }}</span>
        </button>
      </template>
      <button type="button" class="contact-item" @click="toggleDarkMode" :style="{ '--hover-color': isDarkMode ? '#ffcc00' : '#666' }" :aria-label="isDarkMode ? '切换到浅色模式' : '切换到深色模式'">
        <i :class="darkModeIconClass"></i>
        <span class="tooltip">{{ isDarkMode ? '浅色' : '深色' }}</span>
      </button>
    </div>
    <Website /> 
    <VisitTimer />

    <Transition name="fade">
      <div v-if="showAbout" ref="aboutDialog" class="overlay" role="dialog" aria-modal="true" aria-label="关于" tabindex="-1" @click.self="closeAbout">
        <div class="modal-content">
          <AboutPage @close="closeAbout" />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showQR" ref="qrDialog" class="overlay" role="dialog" aria-modal="true" aria-label="二维码" tabindex="-1" @click.self="hideQRCode">
        <div class="modal-content">
          <img :src="qrCodeSrc" alt="二维码" class="qr-image">
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import contacts from '../config/links.json';
import predefinedDescriptions from '../config/descriptions.json';
import Website from './Website.vue';
import AboutPage from './AboutPage.vue';
import VisitTimer from './VisitTimer.vue';
import Typed from 'typed.js';

const showQR = ref(false);
const showAbout = ref(false);
const qrCodeSrc = ref('');
const aboutDialog = ref(null);
const qrDialog = ref(null);
const lastFocusedElement = ref(null);
const profileImage = ref(import.meta.env.VITE_APP_PROFILE_IMAGE_URL || 'https://img.mlhh.cn/file/BQACAgUAAyEGAATjI15nAAOcaoRuEOpKqct2Sp9frfKwN2DNYJwAAjEnAAI0MShUaSGxP90aDTI9BA.jpg');
const userName = ref(import.meta.env.VITE_APP_USER_NAME || '十安');
const descriptionElement = ref(null);

let typedInstance = null;

const initializeTyped = () => {
  typedInstance = new Typed(descriptionElement.value, {
    strings: predefinedDescriptions,
    typeSpeed: 120,
    backSpeed: 80,
    showCursor: true,
    cursorChar: '|',
    loop: true,
  });
};

onMounted(() => {
  initializeTyped();
});

onUnmounted(() => {
  typedInstance?.destroy();
});

const focusDialog = async (dialogRef) => {
  await nextTick();
  dialogRef.value?.focus();
};

const rememberFocus = () => {
  lastFocusedElement.value = document.activeElement;
};

const restoreFocus = () => {
  lastFocusedElement.value?.focus?.();
  lastFocusedElement.value = null;
};

const toggleQRCode = (qrCode) => {
  if (!qrCode) return;
  rememberFocus();
  qrCodeSrc.value = qrCode;
  showQR.value = true;
  focusDialog(qrDialog);
};

const hideQRCode = () => {
  showQR.value = false;
  restoreFocus();
};

const toggleInfo = () => {
  if (showAbout.value) {
    closeAbout();
    return;
  }
  rememberFocus();
  showAbout.value = true;
  focusDialog(aboutDialog);
};

const closeAbout = () => {
  showAbout.value = false;
  restoreFocus();
};

const closeOverlaysOnEsc = (event) => {
  const dialog = aboutDialog.value || qrDialog.value;
  if (!dialog) return;

  if (event.key === 'Escape') {
    showAbout.value = false;
    showQR.value = false;
    restoreFocus();
    return;
  }

  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

onMounted(() => window.addEventListener('keydown', closeOverlaysOnEsc));
onUnmounted(() => window.removeEventListener('keydown', closeOverlaysOnEsc));

const isDarkMode = ref(false);
const darkModeIconClass = computed(() => isDarkMode.value ? 'fas fa-sun' : 'fas fa-moon');

const applyDarkMode = (enabled) => {
  isDarkMode.value = enabled;
  document.documentElement.classList.toggle('dark-mode', enabled);
};

const toggleDarkMode = () => {
  const enabled = !isDarkMode.value;
  applyDarkMode(enabled);
  try {
    localStorage.setItem('darkMode', String(enabled));
  } catch {
    // Theme remains active for this session when storage is unavailable.
  }
};

onMounted(() => {
  let savedDarkMode = null;
  try {
    savedDarkMode = localStorage.getItem('darkMode');
  } catch {
    // Use the system preference when storage is unavailable.
  }

  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyDarkMode(savedDarkMode === null ? prefersDarkMode : savedDarkMode === 'true');
});
</script>

<style scoped>
.content {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin: auto;
  width: 100%;
  max-width: 960px;

  .user-profile-container {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .user-profile-image {
    display: flex;
    border-radius: 50%;
    box-shadow: 0 2px 8px var(--shadow-color);
    padding: 5px;
    border: 3px solid var(--border-color);
    position: relative;

    .profile-button {
      display: flex;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: none;
      cursor: pointer;

      &:focus-visible {
        outline: 2px solid var(--hover-link-color);
        outline-offset: 4px;
      }
    }

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }

    .status-ball {
      position: absolute;
      background: #00c800;
      width: 2em;
      height: 2em;
      border-radius: 20px;
      border: 3px solid #eee;
      bottom: 5px;
      right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      z-index: 1;
      cursor: pointer;
      overflow: hidden;

      &::before {
        content: "在线中";
        color: #00c800;
        opacity: 0;
        transition: opacity 0.3s ease-in-out, color 0.1s ease-in-out;
      }

      @media (hover: hover) {
        &:hover {
          width: 4.5em;
          height: 2em;
        }

        &:hover::before {
          opacity: 1;
          color: #eee;
        }
      }
    }
  }

  .user-name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.3em;

    h1 {
      margin: 0;
    }
  }

  .name-style {
    position: relative;

    &:before {
      position: absolute;
      border-radius: 5px;
      bottom: 0;
      left: 50%;
      transform: translate(-50%);
      z-index: -1;
      content: "";
      background: #ffcc00ad;
      height: 30%;
      width: 110%;
      transition: height 0.3s ease-in-out;
    }
    @media (hover: hover) {
      &:hover::before {
        height: 60%;
      }
    }
  }

  .description {
    display: flex;
    min-height: 32px;
    width: 100%;
    max-width: 500px;
    font-family: 'Georgia', serif;
    font-size: 1.2rem;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;

    &::before,
    &::after {
      content: '"';
      font-size: 1.5em;
      color: #999;
      margin: 0 10px;
    }

    p {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .contact-section {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 5px 10px;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    transition: all 0.3s ease-in-out;

    .contact-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      min-height: 32px;
      padding: 0;
      color: var(--text-color);
      background: none;
      border: 0;
      font: inherit;
      font-size: var(--icon-size);
      cursor: pointer;
      transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
      position: relative;

      .fas.fa-moon {
        width: 20px;
        height: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }

      &:focus-visible {
        outline: none;
        transform: translateY(-5px) rotate(10deg);
        color: var(--hover-color);

        .tooltip {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      @media (hover: hover) {
        &:hover {
          transform: translateY(-5px) rotate(10deg);
          color: var(--hover-color);

          .tooltip {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      }

      .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, 10px);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        white-space: nowrap;
        pointer-events: none;
      }
    }

    @media (hover: hover) {
      &:hover {
        backdrop-filter: blur(10px);
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 8px var(--shadow-color);
        background-color: rgba(var(--background-color-rgb), 0.2);
      }
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) max(16px, env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    overscroll-behavior: contain;
    z-index: 1000;
  }

  .modal-content {
    display: flex;
    justify-content: center;
    width: 100%;
    max-height: 100%;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease-out;
    
    .modal-content {
      transition: all 0.3s ease-out;
    }
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    
    .modal-content {
      transform: translateY(30px) scale(0.8);
      opacity: 0;
    }
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    
    .modal-content {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  .qr-image {
    display: block;
    width: min(300px, calc(100vw - 72px));
    height: auto;
    aspect-ratio: 1;
    object-fit: contain;
    background: white;
    padding: clamp(12px, 4vw, 20px);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 8px var(--shadow-color);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;

    @media (hover: hover) {
      &:hover {
        transform: scale(1.03) translateY(-5px);
        box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .content {
    gap: 15px;
  }
  .content .user-profile-container {
    flex-direction: column;
    gap: 0;
  }

  .content .user-name {
    align-items: center;
    text-align: center;
  }

  h1 {
    font-size: 1.5em;
  }

  .content .description {
    min-height: 72px;
    padding: 0 8px;
    white-space: normal;
    overflow: visible;
    align-items: flex-start;
    line-height: 1.45;
  }

  .content .description::before,
  .content .description::after {
    margin: 0 5px;
  }

  .content .description p {
    display: -webkit-box;
    min-width: 0;
    white-space: normal;
    overflow: hidden;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .content *,
  .content *::before,
  .content *::after {
    scroll-behavior: auto;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
