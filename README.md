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

- 2026-08-09：将全局字体替换为本地 `YSHST.woff2`。
- 2026-08-09：优化页面滚动、弹层、二维码、引语、网站卡片、页脚及非头像交互的响应式布局与可访问性，头像相关内容保持不变。
- 2026-08-09：将萌备案更新为 `萌ICP备20240301号`，并同步更新查询链接。
- 2026-08-09：前端第二轮打磨：桌面内容垂直居中、Swiper 释放边缘滚轮、触屏 hover 防粘滞、弹层可访问性、触摸优化与动画降级。
