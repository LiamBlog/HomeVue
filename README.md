## 个人主页

基于Vue的个人主页，刚接触Vue不太会用各种插件，代码有点难看，大佬们见谅

### Demo

- [预览](https://bsgun.cn)

### 修改

图标默认采用Font Awesome，如需修改图标，请前往 [Font Awesome](https://fa6.dashgame.com/) 复制图标

- 修改联系方式 **`src/config/links.json`** 文件中的内容值即可
- 修改网站列表 **`src/config/site.json`** 文件中的内容值即可

### 部署

* **安装** [node.js](https://nodejs.org/zh-cn/) **环境**

  > node > 16.16.0
  > npm > 8.15.0

* 然后以 **管理员权限** 运行 `cmd` 终端，并 `cd` 到 项目根目录
* 在 `终端` 中输入：

```bash
# 安装依赖
npm install
# 预览
npm run dev
# 构建
npm run build
```
> 构建完成后，静态资源会在 **`dist` 目录** 中生成，可将 **`dist` 文件夹下的文件**上传至服务器，也可使用 `Vercel` 等托管平台一键导入并自动部署

### Vercle部署

>点击后自动部署并创建仓库

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JLinMr/Home-Vue&repository-name=Home-Vue)

### 动态版本

如果你需要支持动态更新配置的版本，可以查看这个分叉项目：[Home-Vue-go](https://github.com/QWQLwToo/Home-Vue-go/)

### 更新记录

> 以下更新均于 2026-08-09 完成；全程未改动头像相关的图片来源、尺寸、圆形样式、边框、定位与状态球。

#### 字体

- 将全局字体替换为本地 `YSHST.woff2`（`src/style.less` 注册 `@font-face`，`html`/`body` 改 `font-family: 'YSHST', sans-serif`），组件级 Georgia 特殊字体保持不变。

#### 布局优化

- 统一页面滚动模型：消除 `html`/`body`/`#app` 多重滚动冲突，主内容区改为 `overflow-y: auto` + `overscroll-behavior` + `scrollbar-gutter`。
- 优化弹层、二维码、引语、网站卡片、页脚及非头像交互的响应式布局与可访问性。
- 移动端用户名与头像居中对齐，引语桌面单行、移动端最多 3 行。

#### 备案变更

- 将萌备案更新为 `萌ICP备20240301号`，并同步查询链接至 `https://icp.gov.moe/?keyword=20240301`。

#### 部署修复

- 修复部署构建失败：将 `index.html` 中的 `%VITE_UMAMI_WEBSITE_ID%`、`%VITE_ICON_LIBRARY%`、`%VITE_FONT_LIBRARY%` 占位符内联为公开值，避免部署环境缺少 `.env` 时 Vite 报 `URI malformed`。
- 修复部署环境名字/头像不显示：`Home.vue` 的 `profileImage`、`userName` 增加 `.env` 缺失时的默认值兜底（头像仍指向原 URL，仅加 `referrerpolicy` 与缺失兜底）。

#### 前端多轮打磨

- **第二轮**：桌面内容垂直居中、Swiper 释放边缘滚轮、触屏 hover 防粘滞（`@media (hover: hover)`）、弹层可访问性、触摸优化与动画降级。
- **第三轮**：基础排版与字体平滑、全局键盘焦点环（`focus-visible`）、主区域平滑滚动与自定义滚动条、Esc 关闭弹层、移动端对齐。
- **第四轮（三方向）**：网站卡片 hover 微交互（上浮/边框高亮/图标主题色与缩放）、关于弹层平滑进场动画（`aboutIn` 关键帧 + 子项错峰）、iPad/折叠屏断点适配。
- **收尾**：深色模式切换平滑过渡、首屏淡入、全局 `prefers-reduced-motion` 减少动态偏好降级。
