var fs = require('fs');

module.exports = function (filePath, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, content, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });        
    });
};