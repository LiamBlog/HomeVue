<template>
  <div class="content">
    <div class="user-profile-container">
      <div class="user-profile-image" v-motion-pop>
        <img :src="profileImage" alt="头像" @click.stop="toggleInfo">
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
        <a v-if="contact.url" :href="contact.url" target="_blank" class="contact-item" :style="{ '--hover-color': contact.hoverColor }">
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
      <div v-if="showAbout" class="overlay" role="dialog" aria-modal="true" aria-label="关于" @click="showAbout = false">
        <div class="modal-content">
          <AboutPage @close="showAbout = false" />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showQR" class="overlay" role="dialog" aria-modal="true" aria-label="二维码" @click="hideQRCode">
        <div class="modal-content">
          <img :src="qrCodeSrc" alt="QR Code" class="qr-image" @click.stop>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import contactsData from '../config/links.json';
import Website from './Website.vue';
import AboutPage from './AboutPage.vue';
import VisitTimer from './VisitTimer.vue';
import Typed from 'typed.js';

const contacts = ref(contactsData);
const showQR = ref(false);
const showAbout = ref(false);
const qrCodeSrc = ref('');
const profileImage = ref(import.meta.env.VITE_APP_PROFILE_IMAGE_URL || 'https://www.mlhh.cn/img/tx.jpg');
const userName = ref(import.meta.env.VITE_APP_USER_NAME || '十安');
const descriptionElement = ref(null);

const predefinedDescriptions = [
  "你好鸭，欢迎来到我的主页！！",
  "随时可以联系我，期待与你交流。",
  "愿你历尽千帆，归来仍是少年。",
  "梦想还是要有的，万一实现了呢？",
  "生命太短，没有时间留给遗憾，若不是终点，请微笑一直向前。",
  "慢品人间烟火色，闲观万事岁月长。",
  "万河归海，终会相遇。",
  "错过了落日余晖，还可以静待满天繁星。",
  "世界，美丽易碎，不必慌乱，只要静然于心，就会海阔天空。",
  "自由散漫的凉风，能治愈乱糟糟的坏心情。",
  "愿你内心山河壮阔，始终相信人间值得。",
  "春来夏往，秋收冬藏，我们来日方长。",
  "每一次日落都是太阳留给天空的温柔。",
  "离别是人间常态，相逢才是意外。",
  "哪来的天生优秀，都是一步一个坑踩过来的。",
  "总要尝遍所有的路，在对生活充满期待。",
  "你未必万丈光芒，但你温暖有光。",
  "种自己的花，爱自己的宇宙。",
  "对于喜欢的事情，都要全力以赴的努力做到最好。",
  "别灰心，普普通通的你也值得万般宠溺。",
  "生活总是来来往往，千万别等来日方长。",
  "你的眸是深情的海，满山的花，堕落了我所有的温情。",
  "不能输给月亮，我也要一直发光发亮。",
  "借一把清风吹开阴霾，接一碗烈酒谈笑风生。",
  "坐看庭前花开花落，笑看天边云卷云舒。",
  "要珍惜的人很多，你在其中名列前茅。",
  "热爱可抵岁月漫长，温柔可挡艰难时光。",
  "宇宙山河烂漫，人间点滴温暖都值得我前进。",
  "爱这世间，草木如书，爱这岁月，素静如湖。",
  "听风八百遍，才知是人间。",
  "跟这个世界交手的许多年来，你是否，光彩依旧，兴趣盎然。",
  "独自走过苍苍莽莽，与你同行才有了光。",
  "你所看到的惊艳，都曾被平庸历练。",
  "迟来的阳光不会拯救凋零的花，但花一定会再次开放。",
  "脚踩在淤泥里，担心要向光明。",
  "岁月这东西是要把人变成各种样子的。",
  "过去的一切你都无法改变，这是基本的物理原理。",
  "山高自有碧云时，月圆总有盈亏时。",
  "世间多少纷扰事，浮华落尽总随风。",
  "时间并不是解药，但时间里藏着解药。",
  "与理想平等交易，同喧嚣保持距离。",
  "前方的风景很好，我的意思是别回头。",
  "没有销声匿迹，我在热爱生活。",
  "天总会亮的，没有太阳也会。",
  "总有人间一两风，填我十万八千梦。",
  "然而生活辽阔，不要只活在爱恨里。",
  "岁月无波澜，余生不悲欢。",
  "在谷底也要开花，在海底也要望月。",
  "在这个夏天和更好的自己见面。",
  "穿自己喜欢的衣服，和不累的人相处。",
  "日子好长，充满希望。",
  "乐观和爱才是生活的解药。",
  "那就在一起，黄昏与四季。",
  "要相信美好的都在路上。",
  "我们在黑暗中并肩前行。",
  "想让每个平凡的日子溢出欢喜。",
  "希望不辜负理想也不辜负热爱。",
  "要在快乐的年纪活的精彩且迷人。",
  "寂静消散，曙光暗涌，都奔向白昼。",
  "最大的心安是：自律温柔和爱自己。",
  "生活总会难过，但好运也会如期而至。",
  "平凡且认真的生活总会变得可爱。",
  "生活给你苦难，其实是在铺垫浪漫。",
  "我频繁的记录着，因为生活很值得。",
  "愿所有美好的事物都奔向我们而来。",
  "岁月迢迢，我们总要有一往无前的力量。",
  "做一个温柔的人，永远不卑不亢清澈善良。",
  "一旦热爱生活，生活就会教你治愈一切的魔法。",
  "会有遗憾的时候，也会有完满的一天，不必担心。",
  "好的坏的我们都收下吧，然后一声不响继续生活。",
  "努力向上才更开心也更滚烫。",
  "所有缝隙都是光照进来的方向。",
  "努力经营当下，直至未来明朗。",
  "路还长，温柔的事一定会发生。",
  "把温柔碾碎，放入生活的缝隙中。",
  "记得向前看，别烂在过去和梦里。",
  "银河撑不起理想，却有温柔和力量。",
  "要在谴倦不尽的爱意里勇敢地生活。",
  "一定要站在你所热爱的世界里闪闪发光！",
  "因为有了人海，相遇才会显得那么意外。",
  "I hope you have a happy day every day."
];

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

const toggleQRCode = (qrCode) => {
  qrCodeSrc.value = qrCode || '';
  showQR.value = !showQR.value;
};

const hideQRCode = () => {
  showQR.value = false;
};

const toggleInfo = () => {
  showAbout.value = !showAbout.value;
};

const isDarkMode = ref(false);
const darkModeIconClass = ref('fas fa-moon');

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);

  localStorage.setItem('darkMode', isDarkMode.value);

  darkModeIconClass.value = isDarkMode.value ? 'fas fa-sun' : 'fas fa-moon';
};

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode.value);
  }

  darkModeIconClass.value = isDarkMode.value ? 'fas fa-sun' : 'fas fa-moon';
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
  margin: auto 0;
  width: 100%;

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
