# 网站部署指南

本指南将详细说明如何将"云护童心"项目部署到 Vercel 平台，使其可以在互联网上访问。

## 部署步骤

### 步骤 1：创建 GitHub 仓库

1. **登录 GitHub**：访问 [GitHub官网](https://github.com) 并登录您的账号
2. **创建新仓库**：
   - 点击右上角的 "+" 按钮，选择 "New repository"
   - 仓库名称：`yunhutongxin-website`（或其他您喜欢的名称）
   - 仓库描述：`云护童心 - 儿童心理健康成长调查系统`
   - 选择 "Public"（公开）仓库
   - 勾选 "Add a README file"（可选）
   - 点击 "Create repository"

### 步骤 2：上传网站文件

1. **克隆仓库**：
   ```bash
   git clone https://github.com/your-username/yunhutongxin-website.git
   cd yunhutongxin-website
   ```

2. **复制文件**：将以下文件复制到仓库目录：
   - `index.html`
   - `script.js`
   - `styles.css`
   - `README.md`
   - `DEPLOYMENT.md`（可选）

3. **提交并推送**：
   ```bash
   git add .
   git commit -m "Initial commit: Add website files"
   git push origin main
   ```

### 步骤 3：部署到 Vercel

1. **登录 Vercel**：访问 [Vercel官网](https://vercel.com) 并使用 GitHub 账号登录

2. **导入项目**：
   - 点击 "New Project"
   - 在 "Import Git Repository" 部分，搜索并选择您刚刚创建的 `yunhutongxin-website` 仓库
   - 点击 "Import"

3. **配置部署**：
   - 项目名称：保持默认或修改为您喜欢的名称
   - 框架预设：选择 "Other"（因为这是纯静态网站）
   - Root Directory：保持默认（`./`）
   - 不需要配置构建命令或输出目录，因为这是纯静态网站
   - 点击 "Deploy"

4. **等待部署完成**：
   - Vercel 会自动构建和部署您的网站
   - 部署完成后，您会看到 "Congratulations! Your deployment is live."

5. **访问网站**：
   - Vercel 会为您的网站分配一个自动生成的域名（如 `yunhutongxin-website.vercel.app`）
   - 点击该链接即可访问您部署在互联网上的网站

## 自定义域名（可选）

如果您有自己的域名，可以将其绑定到 Vercel 部署：

1. **在 Vercel 项目设置中**：
   - 导航到您的项目 → "Settings" → "Domains"
   - 输入您的域名（如 `yunhutongxin.example.com`）
   - 点击 "Add"

2. **在域名提供商处**：
   - 登录您的域名提供商控制台
   - 添加 CNAME 记录，将您的域名指向 Vercel 提供的目标（如 `cname.vercel-dns.com`）

3. **等待 DNS 生效**：
   - DNS 更改可能需要几分钟到几小时才能生效
   - Vercel 会自动为您的域名配置 SSL 证书

## 部署验证

部署完成后，您可以通过以下方式验证网站是否正常运行：

1. **访问网站**：使用 Vercel 提供的域名或您的自定义域名访问网站
2. **测试功能**：
   - 尝试登录不同角色（学生、老师、管理员）
   - 填写测评问卷并提交
   - 查看测评结果和资源包
   - 测试 AI 分析功能

## 常见问题

### 1. 部署失败

**原因**：可能是文件结构不正确或缺少必要文件

**解决方案**：
- 确保所有必要文件（index.html, script.js, styles.css）都已上传
- 检查文件路径是否正确
- 查看 Vercel 部署日志以获取详细错误信息

### 2. 网站无法访问

**原因**：可能是 DNS 配置问题或部署尚未完成

**解决方案**：
- 检查 Vercel 部署状态
- 等待 DNS 配置生效（如果使用自定义域名）
- 尝试使用 Vercel 提供的自动生成域名访问

### 3. AI 分析功能无法使用

**原因**：可能是 API 密钥配置问题或网络连接问题

**解决方案**：
- 检查 `script.js` 文件中的 API 密钥是否正确
- 确保网站可以正常访问外部 API（无网络限制）
- 查看浏览器控制台以获取详细错误信息

## 技术支持

如果您在部署过程中遇到任何问题，可以：

1. 查看 [Vercel 官方文档](https://vercel.com/docs)
2. 参考 [GitHub 帮助中心](https://help.github.com)
3. 联系项目组寻求帮助

## 部署完成

恭喜！您的 "云护童心" 网站已成功部署到互联网上，现在可以通过分配的域名访问。

---

**部署成功后，您的网站将具有以下优势**：
- ✅ 全球可访问（通过互联网）
- ✅ 自动 CDN 加速（提高访问速度）
- ✅ 自动 SSL 证书（HTTPS 安全访问）
- ✅ 自动部署（推送代码后自动更新）
- ✅ 免费使用（Vercel 免费计划）

祝您的 "云护童心" 项目取得圆满成功！