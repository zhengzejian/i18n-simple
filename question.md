## 如果按下 `F5` 后, 在命令面板(`Ctrl+Shift+P`)输入 `Hello World` 命令, 提示没有匹配的命令

大概率是插件指定的版本大于当前你使用的 vscode 版本.

1. 在命令行输入 `code -v `, 查看当前 vscode 的版本
2. 查看 `package.json`  `engines.vscode` 查看插件支持的最低兼容版本
3. 如果版本不匹配, 那就升级 vscode 或者 修改插件兼容的最低版本
