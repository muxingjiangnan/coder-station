# Coder-Station

## 项目概述

大家好，这是我开发的一个类似 SegmentFault 的技术问答社区平台，名叫 Coder-Station。项目采用前后端分离架构，包含两个独立的 React 应用：前台用户系统和后台管理系统。

作为一个全栈项目，我希望通过这个平台为开发者提供一个交流技术、分享知识的空间，同时也作为我个人学习 React 全栈开发的实践项目。

## 核心功能

### 前台系统 (Client)

- **问答系统**：支持发布、浏览、评论技术问答，包含分页展示和分类筛选
- **书籍系统**：展示技术书籍列表和详情
- **面试题系统**：分类浏览面试题
- **搜索功能**：支持问答和书籍搜索
- **用户系统**：登录注册、个人中心、积分系统

### 后台系统 (Background-System)

- **管理员管理**：添加、管理管理员账号，支持权限控制
- **用户管理**：管理用户账号和状态
- **内容管理**：管理问答、评论、书籍、面试题和分类
- **权限系统**：基于角色的权限控制

## 技术栈

### 前台系统 (Client)

- **React 18.2.0**：使用最新版本的 React，支持并发特性
- **React Router v6**：现代化的路由管理
- **Redux Toolkit**：官方推荐的状态管理方案
- **Ant Design 4.24.0**：UI 组件库
- **Vite**：极速的构建工具
- **Axios**：网络请求

### 后台系统 (Background-System)

- **Umi Max 4.5.3**：企业级 React 应用框架
- **Ant Design 5.4.0**：最新版本的 UI 组件库
- **Pro Components**：高级组件库
- **DVA**：数据流方案
- **@ant-design/plots**：数据可视化

## 项目结构

### 前台系统

```
client/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口层
│   ├── components/     # 公共组件
│   ├── css/            # 样式文件
│   ├── fonts/          # 字体文件
│   ├── pages/          # 页面组件
│   ├── redux/          # 状态管理
│   ├── router/         # 路由配置
│   └── utils/          # 工具函数
├── vite.config.js      # Vite 配置
└── package.json
```

### 后台系统

```
background-system/
├── src/
│   ├── .umi/           # Umi 生成文件
│   ├── assets/         # 静态资源
│   ├── components/     # 公共组件
│   ├── constants/      # 常量定义
│   ├── models/         # DVA models
│   ├── pages/          # 页面组件
│   ├── services/       # 服务层
│   └── utils/          # 工具函数
├── .umirc.js           # Umi 配置
└── package.json
```

## 快速开始

### 前置条件

- Node.js 16+
- MongoDB

### 启动步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/muxingjiangnan/coder-station.git
   cd coder-station
   ```

2. **启动服务器**（需要先准备后端服务器）

   从课件资料获取服务器项目 `coderstation-server`（Express + MongoDB），进入目录并启动：

   ```bash
   npm i
   npm start
   ```

   服务器会在 `http://localhost:7001` 启动。

3. **启动前台系统**

   ```bash
   cd client
   npm i
   npm run dev
   ```

   前台系统会在 `http://localhost:3000` 启动。

4. **启动后台系统**

   ```bash
   cd ../background-system
   npm i
   npm run dev
   ```

   后台系统会在 `http://localhost:8000` 启动。

## 数据恢复

如果需要恢复初始数据：

1. 确保 MongoDB 服务已启动
2. 使用 `mongorestore` 命令恢复数据：

   ```bash
   mongorestore -h localhost:27017 -d coderstation --dir /path/to/coderstationData
   ```

## 注意事项

1. **API 接口**：前后端通信使用 JWT Token 认证，Token 存储在 localStorage 中
2. **权限管理**：后台系统支持超级管理员和普通管理员两种角色
3. **构建部署**：
   - 前台：`npm run build`，输出到 `client/build` 目录
   - 后台：`npm run build`，输出到 `background-system/dist` 目录
4. **开发环境**：Vite 开发服务器已配置代理，将 API 请求转发到 `http://localhost:7001`

## 技术亮点

1. **双构建工具方案**：前台使用 Vite 获得极速开发体验，后台使用 Umi Max 享受企业级开箱即用的便利
2. **现代化状态管理**：前台使用 Redux Toolkit 简化 Redux 配置，后台使用 DVA 统一数据流
3. **完善的权限系统**：基于 Umi Access 实现的多级权限管理
4. **优秀的 UI 组件库**：前后台分别使用 Ant Design 4 和 5 版本，结合 Pro Components 提升开发效率
5. **Markdown 编辑器**：集成 Toast UI Editor，支持中文

## 未来规划

### 短期计划（1-2周）
- 为前台系统添加 ESLint + Prettier 配置
- 添加全局错误边界（Error Boundary）
- 统一 Loading 状态管理
- 添加基础单元测试

### 中期计划（1-2月）
- 前台系统迁移到 TypeScript
- 完善类型定义
- 添加图片懒加载
- 实现虚拟列表
- 添加 API 文档

### 长期计划（3-6月）
- 引入监控系统（如 Sentry）
- 实现 CI/CD 流程
- 添加 E2E 测试
- 性能监控与优化
- 国际化支持

## 项目总结

Coder-Station 是我精心打造的一个 React 全栈项目，融合了现代前端开发的最佳实践。通过这个项目，我不仅学习了 React 生态的各种技术，也锻炼了全栈开发能力。

项目的核心优势在于：
- 架构清晰，模块划分合理
- 技术选型现代化，使用了最新的 React 生态工具
- 组件化设计良好，代码复用率高
- 权限系统完善，安全可靠

当然，项目还有一些需要改进的地方，比如测试覆盖率较低、文档不够完善等。但总体而言，这是一个功能完整、技术先进的技术问答社区平台，适合作为学习参考或进一步扩展开发。

如果您对项目有任何建议或问题，欢迎在 GitHub 上提交 issue 或 pull request！

---

**项目版本**: Client v0.1.0 | Background-System v1.0.0
**最后更新**: 2026-04-10