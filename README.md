## 简介

Paper 是一款类似 Typora 的 Markdown 编辑器，同时还增添了许多实用功能，使其成为免费的 Typora 替代品。

Paper 引入了富文本编辑模式，保证文件本地存储的同时，提供更多自由且完善的样式定制选项。

我们计划为 Paper 添加如下扩展功能，进一步丰富其编辑体验：

    - 无服务版本备份功能：登录并设置账户，便可将本地文件同步至阿里云盘等存储位置，支持手动或自动备份。
    - 同步功能：提供加密的远程服务，需要手动触发以同步数据，确保数据私密安全。
    - 历史版本：为每个文件保存五个历史版本，随时回退至指定时间点。
    - 个人博客生成：基于远程服务，搭建个人博客系统，仅建立系统而不公开作品。发布需在文章中点击生成链接，可设置访问密码、付费阅读和字数限制等。
    - 抽取翻译：文章内直接翻译并抽取为单独文件保存。
    - 图片生成：为微博等平台生成宽度默认为750像素的图片，支持自定义尺寸。
    - PDF生成：便于打印时保留原样式。
    - 翻译：暂用百度翻译，如条件允许，将接入 GPT 进行翻译及其他任务。
    - 自动粘贴：开启后将自动粘贴复制内容至文件。
    - 图床：支持上传不超过1MB的图片至服务器。
    - 为保障安全，所有操作均需经过您的手动触发。

## 开发环境的安装

    默认node版本18.15.0

    electron 安装在某些情况下可能失败。可以按照如下的办法尝试。

    打开 ~/.npmrc文件中，单独设置Electron的镜像。添加如下一行

    electron_mirror="https://npm.taobao.org/mirrors/electron/"

## 项目模板

    https://github.com/jooy2/vutron

## 定制安全策略

    Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
    参考：https://juejin.cn/post/6844904174434385933

## 资源

    右键菜单  https://imengyu.top/pages/vue3-context-menu-docs/
    文件结构和UI element-pluss
    icon awesome-font
