# 贡献指南

感谢你为 dsh-arknights 制作新的皮肤。仓库只接收完整、可独立安装的 DSH Web 皮肤，不接收无人维护的纯素材投稿。

## 目录与命名

- 新作品放在 `skins/<英文角色标识>/`。
- 展示名使用中文角色名，例如“阿米娅和博士”；目录使用小写英文和连字符，例如 `amiya-doctor`。
- 单人作品直接使用角色英文名，例如 `amiya`。
- 包名、皮肤 ID、wiring ID 和 body 属性必须在仓库内唯一。

## 必交内容

- 完整插件源码、测试、构建脚本和预构建 `lib/`；
- `package.json`、`skin.json`、`cordis.patch.yml`、README、LICENSE 和 NOTICE；
- 至少一张真实 DSH Web 界面的 `preview/cover.webp`；
- 素材来源、作者、生成或修改方式，以及第三方权利说明；
- 本地测试、类型检查和构建结果。

运行以下检查：

```powershell
pnpm install
pnpm check
```

每套插件的运行包体不得超过 20 MiB，浏览器运行时不得依赖远程图片。提交的构建产物必须由仓库内源码与素材生成，不能包含绝对本机路径。

投稿皮肤可以保持 `private: true`，也可以独立发布到 npm。公开包必须声明 `publishConfig.access: "public"`，并使用标准 `repository` 对象指向本仓库及对应的 `skins/<英文角色标识>` 子目录，避免插件市场把包关联到错误作品。

## 素材与许可

- 原创源代码须接受 MIT License。
- 原创美术素材须接受 CC BY-NC-SA 4.0。
- 投稿者必须有权提交和授权相关内容，并在 NOTICE 中披露素材来源与第三方角色归属。
- 不得提交官方 Logo、水印、付费素材、来源不明素材或冒充官方的内容。

## Pull Request

一个 Pull Request 只新增或修改一套皮肤。请完成 PR 模板中的检查项，并在说明中附上代表截图。维护者会检查安装、交互安全、生命周期清理、响应式布局、许可和素材来源。
