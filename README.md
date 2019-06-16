### 基于Node.js的前端Cli工具（创建命令行工具）

* 繁琐重复性 `npm install`loader,plugin等工作
* 库都在升级版本，如果每次都重新弄，难免会出现版本不对的错误
* 创建新项目时，经常出现错误，总要花时间去拍错

#### 知识点

* package.json

  `package.json`文件的`bin`属性是一个对象，key为命令名（会生成在node_modules/.bin目录下），值为对应的执行文件

* commander.js

  TJ开发的nodejs处理命令行的库包括解析命令和参数

  * option

    定义命令选项（长短标识符中间使用逗号、竖线、空格分隔）、描述、默认值

    `command.js`默认设置了两个option

    ```javascript
    commander
        .option('-V, --version', '查看版本号')
    	.option('-h, --help', '查看帮助')
    ```

  * command

    定义子命令

  * alias

    子命令设置别名

  * usage

    使用说明

  * action

    执行命令后的回调

  * version

    设置版本号，并且查看版本号

  * description

    描述

**注意**

`commander.js`支持git风格的的子命令处理，可以根据子命令自动引导到特定格式(`[command]-[subcommand]`)命名的文件，调用command时候，第二个参数存在，且没有显示调用action

#### 步骤

* 验证并创建工程目录
  * 当前目录为空目录，如果工程目录和当前目录相同，则无需创建工程目录，直接拷贝模板目录，不同则先创建工程目录
  * 当前目录不为空目录，如果工程目录和当前子目录相同，则提示该目录已存在的错误，不同则创建工程目录
* 下载git模板，然后递归拷贝所有目录到目标地址
* 通过命令行输入动态的改变模板的文件内容，比如`package.json`的name、description、verison、author
* 有颜色的显示控制台
* 删除不必要的模板文件(待做)

