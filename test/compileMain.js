const { compile } = require('./compile');
const path = require('path');

compile([path.join(__dirname, 'main.ts')]);
