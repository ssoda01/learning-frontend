<!-- ---
sidebar_position: 2
--- -->

# Intro

当我用tailwind+nextjs的时候 看到可以安装模板
```
npx create-next-app nextjs-blog --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/assets-metadata-css-starter"

```

- 怎么实现的
- 会有什么效果

来问一下Chatgpt
1. `--use-npm` 告诉 create-next-app 使用 npm 作为包管理器而不是默认的 yarn。这意味着在安装依赖包时，使用的是 npm 的命令而不是 yarn 的命令。如果你不指定 --use-npm，create-next-app 会自动使用 yarn 作为包管理器。
2. ` --example` 命令行选项用于指定创建新 Next.js 应用程序时要使用的示例模板。在这个命令中，我们指定了 https://github.com/vercel/next-learn/tree/master/basics/assets-metadata-css-starter 作为示例模板的 GitHub 存储库链接。create-next-app 将从该存储库克隆文件，并将其用作新应用程序的初始模板。
    在 Next.js 的官方文档中可以找到有关 --example 参数的详细信息。当使用 npx create-next-app 命令时，可以通过指定 --example 参数来选择一个示例模板或蓝图，这些模板和蓝图有助于快速搭建具有特定功能或结构的 Next.js 应用程序。

    通过在运行 npx create-next-app 命令时使用 --example 参数，可以将其值设置为指定的示例模板名称。一旦安装完成，您将在新的 Next.js 应用程序中使用所选择的示例模板。

    您可以在 Next.js 官方文档的以下部分中找到有关示例的更多信息：https://nextjs.org/docs/api-reference/create-next-app#example

    ```shell
      --example-path <path-to-example>
 
    In a rare case, your GitHub URL might contain a branch name with
    a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar).
    In this case, you must specify the path to the example separately:
    --example-path foo/bar
    ```

    

