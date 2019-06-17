// rmdir和rmdirSync只能删除空目录，所以需要使用递归进行删除
var fs = require('fs'),
    path = require('path');

module.exports = function removeDir (dirPath) {
    var stat, files;

    // 判断目录是否存在
    if (!fs.existsSync(dirPath)) {
        return;
    }

    files = fs.readdirSync(dirPath), stat = fs.statSync(dirPath);

    // 如果目录存在文件，则递归
    if (files.length) {
        files
            .map(function (filePath) {
                return path.join(dirPath, filePath);
            })
            .forEach(removeDir);
    // 如果是空目录，则直接删除
    } else if (stat.isDirectory()) {
        fs.rmdirSync(dirPath);
    // 如果是空文件，也直接删除
    } else if (stat.isFile()) {
        fs.unlinkSync(dirPath);
    }
};