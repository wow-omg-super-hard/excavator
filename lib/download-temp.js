var download = require('download-git-repo');

module.exports = function (remote, target) {
    return new Promise(function (resolve, reject) {
        download(remote, target, { clone: true }, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(target);
            }
        });        
    });
};