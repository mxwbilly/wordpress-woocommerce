# GreenSmart - 智能自动浇水花盆官网

## 项目简介

GreenSmart 是一个现代化的单页面展示网站，用于展示智能自动浇水花盆产品系列。

## 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **JavaScript (ES6+)** - 交互效果
- **Font Awesome** - 图标库
- **Google Fonts** - 字体

## 目录结构

```
├── index.html          # 主页面
├── package.json        # 项目配置
├── README.md           # 项目说明
└── src/                # 源代码目录
    ├── assets/         # 静态资源（图片、图标等）
    ├── components/     # 组件（可扩展）
    ├── scripts/        # JavaScript脚本
    │   └── main.js     # 主脚本文件
    └── styles/         # 样式文件
        └── main.css    # 主样式文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:8000 查看页面

### 生产构建

```bash
npm run build
```

构建产物将生成在 `dist/` 目录

## 部署指南

### 本地部署

```bash
npm start
```

### 云服务器部署

1. **安装依赖**
   ```bash
   npm install
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署到服务器**
   ```bash
   # 使用 rsync（推荐）
   rsync -avz dist/ user@your-server:/var/www/html/
   
   # 或使用 scp
   scp -r dist/* user@your-server:/var/www/html/
   ```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建并运行:

```bash
docker build -t greensmart .
docker run -p 80:80 greensmart
```

## 功能特性

- ✅ 响应式设计，支持移动端
- ✅ 平滑滚动导航
- ✅ 产品卡片悬停效果
- ✅ 加入购物车动画
- ✅ 表单提交反馈
- ✅ 图片懒加载动画
- ✅ 订阅邮件功能

## 自定义配置

### 替换图片

所有产品图片都在 `index.html` 中定义，替换方式：

1. 将图片放入 `src/assets/` 目录
2. 修改 `index.html` 中的 `<img>` 标签的 `src` 属性

示例：
```html
<img src="src/assets/your-image.jpg" alt="产品图片">
```

### 修改主题色

在 `src/styles/main.css` 中修改 CSS 变量：

```css
:root {
    --primary-color: #22c55e;  /* 主色调 */
    --primary-dark: #16a34a;   /* 深色版本 */
}
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
