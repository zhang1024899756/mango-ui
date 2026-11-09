# Mango UI 发布规范（Publishing）

> **铁律：先改 `version`，再 `pnpm build`，最后 `npm publish`。**
> 顺序反了只有两种结局：发出去的是旧代码，或者被 registry 用 `E403` 拒收。

| 项 | 值 |
| --- | --- |
| 包名 | `@arvinzxy/mango-ui`（公开包，`publishConfig.access: "public"`） |
| registry | `https://registry.npmjs.org/` |
| 维护者 | `zhang1024899756`（npm 组织 `arvinzxy` 的 owner） |
| 当前版本 | **2.2.0**（2026-11-09 首次发布成功） |
| 发布方式 | 本地手动发布（暂无 CI 自动发布，原因见 §4.3） |

本文是**唯一权威**的发布流程。`CONTRIBUTING.md` 只管怎么把组件写好，发版只按这一份。

---

## 0. 一屏速查

```bash
cd mango-ui
git checkout main && git pull --ff-only
pnpm install --frozen-lockfile

# 1) 先定版本（唯一权威来源：package.json）
npm version 2.3.0 --no-git-tag-version

# 2) 再构建（dist 必须由这次源码 + 这次版本产出）
pnpm type-check && pnpm test
pnpm build
npm pack --dry-run          # 看一眼要上传什么

# 3) 发布（2FA 见 §4）
npm publish

# 4) 验证（§5）→ 提交 + 打 tag + 推（§6）
npm view @arvinzxy/mango-ui version
git add package.json docs/.vitepress/config.ts
git commit -m "chore(release): v2.3.0"
git tag v2.3.0 && git push origin main --follow-tags
```

⚠️ 这三步的顺序不可交换：**version → build → publish**。理由见 §3。

---

## 1. 包身份与权限

- **包名**：`@arvinzxy/mango-ui`。scope 必须是 npm 上真实存在的组织，且发布账号在组织内是 owner / write 角色：

  ```bash
  npm whoami          # 期望：zhang1024899756
  npm org ls arvinzxy # 期望：自己的账号是 owner
  ```

- **公开可见**：`package.json` 里 `publishConfig.access = "public"`。不要用 `--access restricted`——restricted 会让 `npm i` 对未登录用户失败。
- **`name` + `version` 在 npm 上不可变**：发布后不能覆盖，**版本号也永久不可复用**（unpublish 之后同样不能再用同一个号，只能升版本）。改名等于开一个新包，历史下载量不会迁移。
- **包名沿革**：

  | 包名 | 状态 |
  | --- | --- |
  | `mango-ui` | 2018 年被第三方占用，不可用 |
  | `@zhang1024899756/mango-ui` | 第一候选；2FA 未完成，**从未发布成功**（registry 上不存在，无需 deprecate） |
  | **`@arvinzxy/mango-ui`** | 2026-11-09 起正式包名 |

- **发布内容**：`package.json` 的 `files` 只有 `dist` 和 `README.md`。`dist/` 被 `.gitignore` 忽略，只存在于本地构建产物；`src/`、`docs/`、Storybook 产物都不会进包。

---

## 2. 版本号怎么定

语义化版本，但**按用户视角**判断，不按 commit 前缀：

| 改动 | 版本 | 例子 |
| --- | --- | --- |
| 删/改公开 API：组件改名、删 prop、默认值变化导致视觉或行为变化、移除模式 | **major** | `MyuiMagic` → `MyuiNeon` 按规矩本该是 3.0.0 |
| 新组件、新 prop、新形体、新令牌 | **minor** | 2.2.0 新增 `skew` 形体与 `GlitchRipple` |
| 修 bug、样式微调、文档、内部重构 | **patch** | 2.2.1 |

规则：

1. **唯一权威来源是 `package.json` 的 `version`**。`dist/` 里不含版本号，不要手改任何构建产物。
2. 用 `npm version <x.y.z> --no-git-tag-version` 改，**不要**让 npm 自动打 tag（它会在版本提交之前打，tag 容易落在错误的提交上）；tag 手动打在发布成功的提交上。
3. 版本号一共出现在三处，`package.json` 是源，其余两处必须跟着改：
   - `package.json` 的 `version`
   - `docs/.vitepress/config.ts` 里 nav 的硬编码文本（当前是 `text: 'v2.2.0'`）——**忘了改，线上文档站的版本号就永远停在旧的**
   - git tag `vX.Y.Z` 与 GitHub Release 标题

---

## 3. 为什么顺序必须是「先 version → 再 build → 再 publish」

1. **build 之前必须定版本**：npm 拒绝重复版本（`E403 You cannot publish over the previously published versions`）。先 build 再改版本，等于拿一次构建去赌版本号没被占用；一旦版本号发错，只能再发一个 patch 补救。
2. **publish 之前必须 build**：包里只有 `dist/`，而仓库里的 `dist/` 是 gitignored 的本地产物。忘了 build 就 publish = 上传上一次的旧构建，或者传一个空包直接失败。
3. **tag 必须打在发布成功的提交上**：先 tag 再 publish，一旦 publish 失败，tag 就指向一个从未发布过的版本。

反例（都会真出问题）：

| 错误顺序 | 后果 |
| --- | --- |
| `pnpm build` → 改 version → `npm publish` | dist 与后来声明的版本/源码不同步，用户拿到旧代码 |
| `npm publish` → 改 version | registry 里已有该版本，直接 `E403` |
| `npm publish` 不 build | 上传旧 dist，或包内容缺失 |
| 先 `git tag` → publish 失败 | tag 指向未发布版本，之后只能删 tag 重打 |

---

## 4. 2FA：用 npm-2fa-auth 插件把授权交给浏览器

npm 自 2026 年起**不再接受验证器 App 的 6 位 TOTP**；账号 `tfa.mode = auth-and-writes` 时，发布必须完成一次浏览器授权。本机已装 **npm-2fa-auth** 插件，流程如下。

### 4.1 在 DSH 会话里发布（本机实际走的路径）

1. 直接执行 `npm publish`。DSH 的 shell 不是 TTY，npm 不会自动拉起浏览器，会返回 `EOTP`，错误体里带一对授权链接（`authUrl` 与 `doneUrl`）；
2. 用插件 **`npm_auth_open_url`** 把 `authUrl` 交给**系统默认浏览器**，在浏览器里点 Approve / Authorize；
3. 让 npm 进程保持存活（它要轮询 `doneUrl`）。拿到一次性口令后它会自动重试上传，返回 `202 Accepted`（包进入处理队列）；
4. `202` 不等于可安装 —— 一定要做 §5 的验证。

> 如果 npm 进程已经退出，重新 `npm publish` 再授权即可；发布失败不会写入 registry，可安全重试。

### 4.2 其他可用路径

| 场景 | 工具 / 做法 | 说明 |
| --- | --- | --- |
| 先确认登录态 | `npm_auth_status` / `npm_auth_verify` | 只读：用户名、账号 2FA 模式、registry 可达性 |
| 走 `npm login --auth-type=web` | `npm_auth_login_web` | npm 自己拉起浏览器，完成后写 `~/.npmrc` |
| 无人值守（本地或 CI） | `npm_auth_capture_token` | 在浏览器建 **bypass-2FA 的 granular access token**（write 权限 + 只选本包 scope），由浏览器直接 POST 写盘，不进对话 |
| 真实终端（PowerShell / Windows Terminal） | 直接 `npm publish` | TTY 下 npm 会自己打开浏览器授权页 |

### 4.3 红线与长期方案

- token / 一次性口令**不得**出现在对话、命令行参数、日志、脚本或仓库文件里；插件返回值只有掩码。
- 不要向任何人索要 6 位 TOTP（npm 已不收，索要的流程本身就是错的）。
- `~/.npmrc` 交给插件管理，不要手写 token；不要把凭据写进仓库里的 `.npmrc`（本仓库的 `.npmrc` 只有 pnpm 配置）。
- granular bypass token 是**过渡方案**：npm 计划 **2027-01 取消**「绕过 2FA 直接发布」。长期方案是 CI 里的 **OIDC 可信发布**（GitHub Actions + `id-token: write`），届时加一个 `publish.yml`，`npm publish` 就不再需要人工授权。

---

## 5. 发布后验证（必做，`202` 不算成功）

```bash
npm view @arvinzxy/mango-ui version            # 期望：新版本号
npm view @arvinzxy/mango-ui dist-tags.latest   # 期望：新版本号
npm view @arvinzxy/mango-ui time --json        # 新版本的发布时刻
```

1. **处理延迟**：发布后 registry 有 `being processed` 窗口（首次发布可长达数分钟）。`npm i` 拿不到新版本时等 1–2 分钟再试，**不要重发**（重发必然 `E403`）。
2. **干净环境安装**（不依赖本仓库的 `node_modules`）：

   ```bash
   TMP=$(mktemp -d) && cd "$TMP" && npm init -y >/dev/null
   npm i @arvinzxy/mango-ui@2.3.0 vue
   node -e "import('@arvinzxy/mango-ui').then(m => console.log(Object.keys(m).length))"
   ```

3. **包内容与本地一致**：`npm pack --dry-run` 的 shasum 应与 `npm view @arvinzxy/mango-ui dist.shasum` 相同；包里应只有 `dist/**` + `README.md`。
4. **已知小现象**：npm 会额外生成一个 `0.0.0-stage` 占位版本（staged publishing 内部使用），没有 dist-tag，`npm i` 不受影响，不需要清理。

---

## 6. 发布之后：提交、tag、文档站

```bash
git add package.json docs/.vitepress/config.ts
git commit -m "chore(release): vX.Y.Z"
git tag vX.Y.Z
git push origin main --follow-tags
gh release create vX.Y.Z --generate-notes   # 可选
```

- **push 到 `main` 会触发两个工作流**：`.github/workflows/ci.yml`（type-check / test / build / docs 门禁）与 `.github/workflows/deploy-docs.yml`（重建 GitHub Pages）。CI 必须绿。
- 文档站的版本号只硬编码在 `docs/.vitepress/config.ts` 的 nav 里，要跟 `package.json` 同步。
- tag 固定 `v<semver>`，与 `package.json` 完全一致。现有 tag：`v1.0.1`（v1 时代）、`v2.2.0`（当前）。
- Storybook 不随包发布（`files` 只有 dist + README），不需要额外处理。
- 发布提交只应包含版本相关文件（`package.json`、nav 版本号、必要的 CHANGELOG），不要把功能改动混进 `chore(release)` 提交。

---

## 7. 失败与撤回

| 现象 | 原因 / 处理 |
| --- | --- |
| `E403 You cannot publish over the previously published versions` | 版本已存在，registry 不可覆盖。升一个版本再发 |
| `E403 Forbidden` / PUT 404 | 账号不在 `arvinzxy` 组织、token 没有 write 权限，或 scope 写错 |
| `EOTP` | 需要 2FA 授权，按 §4 走；反复出现时检查本机系统时间的偏差 |
| 发布成功但 `npm i` 拿不到 | registry 还在处理，等 1–2 分钟；先用 `npm view ... version` 确认 |
| 包内容为空 / 缺 dist | 忘了 `pnpm build`，或 `files` 字段被改坏 |
| 发错了但版本可接受 | 优先发 patch 修复；需要标记时用 deprecate，不要 unpublish |
| 必须彻底移除某版本 | 发布 **72 小时内**可 `npm unpublish @arvinzxy/mango-ui@x.y.z --force`（有依赖者时会被拒绝）；**该版本号永久作废**。若把包的全部版本都下线，24 小时内不能再发布该包的新版本。这是事故手段，不是常规流程 |

```bash
# 标记一个版本不再推荐使用（推荐做法）
npm deprecate @arvinzxy/mango-ui@2.2.1 "已废弃：请升级到 2.2.2"
```

---

## 8. 发版记录（事实留档）

| 版本 | 日期 | 结果 |
| --- | --- | --- |
| **2.2.0** | 2026-11-09 | 首次成功发布到 npm；浏览器 2FA 授权一次通过；tarball 56 文件 / 129.7 kB；本地 `npm pack` 的 shasum（`3a8979e8…88c2`）与 registry 一致；公开包，`latest` = 2.2.0 |
| 2.1.0 | 2026-11-08 | Neon / Text 上线（只上 GitHub Pages，未发 npm） |
| 2.0.0 | 2026-11-08 | Vue 3 赛博朋克重写（只上 GitHub Pages） |

---

## 9. 检查清单（复制到 issue 里逐条勾）

**发布前**

- [ ] `git status --short` 干净（或只有本次版本要提交的改动）
- [ ] 在 `main` 且已 `git pull --ff-only` 到最新
- [ ] `pnpm install --frozen-lockfile`
- [ ] `npm whoami` 是 `zhang1024899756`，且是 `arvinzxy` 的 owner
- [ ] `package.json` 的 `version` 已改，且 registry 上不存在：`npm view @arvinzxy/mango-ui versions --json`
- [ ] `docs/.vitepress/config.ts` 的 nav 版本号已同步
- [ ] 全仓库没有残留旧包名：`grep -rn "@zhang1024899756/mango-ui" --include=*.md --include=*.ts --include=*.json . | grep -v node_modules`
- [ ] `pnpm type-check` / `pnpm test` / `pnpm build` / `pnpm docs:build` 全绿
- [ ] `npm pack --dry-run` 内容正确（有 dist、有 README、无 src）

**发布中**

- [ ] `npm publish`（2FA 按 §4 在浏览器里授权）
- [ ] `npm view @arvinzxy/mango-ui version` 与 `dist-tags.latest` 已是新版本

**发布后**

- [ ] 干净目录安装 + `import` 验证通过
- [ ] `git commit` + `git tag vX.Y.Z` + `git push origin main --follow-tags`
- [ ] CI 绿、Pages 部署成功、文档站 nav 显示新版本
- [ ] （可选）GitHub Release

---

## 10. 相关文件

- [`package.json`](package.json)：`name` / `version` / `files` / `publishConfig`
- [`docs/.vitepress/config.ts`](docs/.vitepress/config.ts)：nav 里硬编码的版本号
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml)：type-check · test · build · docs 门禁
- [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml)：GitHub Pages 部署（`DOCS_BASE=/mango-ui/`）
- [`CONTRIBUTING.md`](CONTRIBUTING.md)：组件写作规范与本地校验
- [`scripts/fix-dts-specifiers.mjs`](scripts/fix-dts-specifiers.mjs)：`build:types` 之后修正 `.d.ts` 的相对路径与样式导入（发布必需，别删）
