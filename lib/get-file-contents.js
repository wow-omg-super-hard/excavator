var fs = require('fs');

module.exports = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, { flag: 'r+', encoding: 'utf8' }, function (err, content) {
            if (err) {
                reject(err);
                return;
            }

            resolve(String(content));
        });    
    });
};