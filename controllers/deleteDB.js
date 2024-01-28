const fs = require('fs');

module.exports = async function(path) {

    return new Promise((resolve, reject) => {

        fs.unlink(path);

        resolve(path +' deleted');
    });
}