const util = require('util');
const Course = require('../parsers');

const filename = process.argv[2];

Course.loadFromFile(filename).then(course => {
    console.log(course);
//     console.log(util.inspect(course, {depth: 6}));
    console.log(util.inspect(course.asJSON(), { depth: null }));
});
