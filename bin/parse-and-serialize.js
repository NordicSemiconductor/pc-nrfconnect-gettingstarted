const sander = require("sander");
const util = require("util");
const { Course } = require("..");

const filename = process.argv[2];

Course.loadFromFile(filename).then(course => {
  console.log(course);
  console.log(util.inspect(course.asJSON(), { depth: null }));
});
