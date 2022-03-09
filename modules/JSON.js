const fs = require('fs');

function LoadJSON(filename = '') {
   return JSON.parse(fs.existsSync(filename) ? fs.readFileSync(filename).toString() : '""');
}

function SaveJSON(filename = '', jsonToImplement = '""') {
   return fs.writeFileSync(filename, JSON.stringify(jsonToImplement, null, 4));
}

module.exports = {
   LoadJSON: LoadJSON,
   SaveJSON: SaveJSON,
};
