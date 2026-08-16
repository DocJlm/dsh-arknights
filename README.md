# dsh-arknights

面向 DeepSeek Harness Web 的明日方舟主题皮肤合集。每套作品都是可独立安装的 DSH 插件，欢迎创作者通过 Pull Request 增加新的单人或多人主题。

> 本仓库是非官方、非商业同人项目，与上海鹰角网络科技有限公司及其关联方无隶属或授权关系。角色、名称与相关知识产权归原权利方所有。

## 皮肤画廊

### 初雪和小羊

[![初雪和小羊效果预览](skins/pramanix-eyjafjalla/preview/cover.webp)](skins/pramanix-eyjafjalla/preview/cover.webp)

| 项目 | 内容 |
| --- | --- |
| 角色 | 初雪、艾雅法拉 |
| 作者 | [DocJlm](https://github.com/DocJlm) |
| 目录 | [`skins/pramanix-eyjafjalla`](skins/pramanix-eyjafjalla) |
| 说明 | 星海玻璃庭园、昼夜背景与双角色响应式布局 |
| 美术许可 | CC BY-NC-SA 4.0（第三方角色权利除外） |

## 安装

```powershell
git clone https://github.com/DocJlm/dsh-arknights
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web add "<仓库路径>\dsh-arknights\skins\pramanix-eyjafjalla"
npx @deepseek-ai/dsh@0.1.0-rc.6 web
```

安装后重新启动 DSH Web 即可生效。每套皮肤的目录中也会提供独立说明。

## 贡献新皮肤

新作品放在 `skins/<英文角色标识>/`，例如：

- “阿米娅和博士”使用 `skins/amiya-doctor/`；
- “阿米娅”使用 `skins/amiya/`。

每个 Pull Request 必须提交完整、可安装、可验证的插件，以及至少一张真实 DSH 界面截图。详细规则见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

- 本仓库原创源代码采用 [MIT License](LICENSE)。
- 背景、角色图、预览图等美术素材采用 [CC BY-NC-SA 4.0](ASSETS-LICENSE.md)。
- 含有内嵌美术数据的构建产物同时受相应素材许可约束。
- 任何许可均不授予第三方角色、名称、商标或其他知识产权。

完整归属和非官方声明见 [NOTICE](NOTICE)。
