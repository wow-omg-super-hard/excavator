var path = require('path'),
    fs = require('fs');

var inquirer = require('inquirer'),
    ora = require('ora'),
    chalk = require('chalk'),
    Handlebars = require('handlebars');

var downloadTemp = require('../lib/download-temp'),
    removeDir = require('../lib/remove-dir'),
    getFileContents = require('../lib/get-file-contents'),
    putFileContents = require('../lib/put-file-contents'),
    generatorMiddleware = require('../lib/generator-middleware');

var questions = [{
    name: 'dest',
    message: '输入新创建的项目目录名',
    default: 'app'
}, {
    name: 'appName',
    message: '输入项目名',
    default: '我是一个项目'
}, {
    name: 'appDescription',
    message: '输入项目描述',
    default: '我是项目描述'
}, {
    name: 'appVersion',
    message: '输入项目版本号',
    default: '0.0.1'
}, {
    name: 'appAuthor',
    message: '输入作者',
    default: '某某某'
}];

// 包裹路径
function __wrapperPath () {
    return path.resolve.apply(path, arguments);
}

inquirer
    .prompt(questions)
    .then(function (answers) {
        generatorMiddleware([
            // 根据条件获取工程目录路径
            function getDestPath (next, state) {
                // 获取当前目录的所有子目录和文件
                var files = fs.readdirSync('.'),
                    currDirName = path.basename(process.cwd()),
                    destName = state.destName;

                // 如果非空目录
                if (files.length) {
                    // 如果子目录存在和要设置的工程目录相同，则提示工程目录已存在，请重新填写
                    if (files.filter(function (file) {
                        return fs.statSync(file).isDirectory() && file === destName;
                    }).length) {
                        console.error(chalk.red(destName + '已经存在，请重新创建'));
                        return;
                    }
                } else if (currDirName === destName) {
                    dest = '.'
                }

                next(Object.assign(state, { 
                    destPath: __wrapperPath(destName) 
                }));    
            },

            // 创建工程目录
            function createDestDir (next, state) {
                fs.mkdir(state.destPath, function (err) {
                    if (err) {
                        console.error(chalk.red('创建' + destPath + '失败，请重新创建'));
                        return;
                    }

                    next(state);
                });
            },

            // 下载github项目结构模板到项目目录
            function downloadDestTemp (next, state) {
                // github项目结构模板地址
                var proUrl = 'direct:https://github.com/wow-omg-super-hard/react-directory-temp.git#master',
                    spinner = ora('正在下载项目结构模板，请等待，源地址：' + proUrl.slice())

                // download-git-repo如果该目录存在也是不能生效的，所以下载前需删除该目录
                removeDir(state.destPath);

                // 增加等待下载的交互
                spinner.start();

                // 开始下载
                downloadTemp(proUrl, state.destPath)
                    .then(function () {
                        spinner.succeed();
                        next(state);
                    })
                    .catch(function (err) {
                        spinner.fail();
                        console.error(chalk.red(err.message));
                    });
            },

            // 将生成的项目中的非图片、font文件的内容占位符替换成命令行输入，比如package.json的项目名、描述、版本号作者通过Handlebars模板引擎替换
            // 目前是简单的，只将项目目录package.json、index.html替换
            function updateDestTemp (next, state) {
                // 获得对应的文件
                var packageJSONFilePath = path.join(state.destPath, 'package.json'),
                    indexViewFilePath = path.join(state.destPath, 'index.html');

                Promise.all([
                    // 获得相关文件的content
                    getFileContents(packageJSONFilePath).then(function (content) {
                       // 通过handlebars模板编译得到content，在写入到对应的文件中
                       putFileContents(packageJSONFilePath, Handlebars.compile(content)(answers)); 
                    }),
                    getFileContents(indexViewFilePath).then(function (content) {
                       putFileContents(indexViewFilePath, Handlebars.compile(content)(answers)); 
                    })
                ]).then(function () {
                    next(Object.assign(state, { status: 0 }));
                }).catch(function (err) {
                    next(Object.assign(state, { status: 1, mes: err.message }));
                });
            },

            // 用颜色表示构建状态
            function chalkStatus (none, state) {
                if (!state.status) {
                    console.log(chalk.green('创建成功:)\n'));
                    console.log(chalk.green('cd ' + proDirPath + '\nnpm install\n npm run start'));
                } else {
                    console.error(chalk.red('创建失败：' + state.mes));
                }
            }
        ], { 
            destName: answers.dest
        });
    });