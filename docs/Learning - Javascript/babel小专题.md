# Babel小专题

参考
- [深入浅出 Babel 上篇：架构和原理 + 实战](https://juejin.cn/post/6844903956905197576)
- [深入浅出 Babel 下篇：既生 Plugin 何生 Macros](https://juejin.cn/post/6844903961820921869)

## Babel的处理流程
- 解析(Parsing)
  - 词法解析
    - 词法解析(Lexical Analysis) js->Tokens
    - 1️⃣ 词法解析(Lexical Analysis)： 词法解析器(Tokenizer)在这个阶段将字符串形式的代码转换为Tokens(令牌). Tokens 可以视作是一些语法片段组成的数组. 例如for (const item of items) {} 词法解析后的结果如下:

  - 语法解析
    - 2️⃣ 语法解析(Syntactic Analysis)：这个阶段语法解析器(Parser)会把Tokens转换为抽象语法树(Abstract Syntax Tree，AST)
- 转换
  - 访问器模式
  - AST转换器
- Generator
    - AST转换为源代码