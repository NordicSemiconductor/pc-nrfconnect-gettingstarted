const sander = require("sander");
const { Course } = require("..");

const filename = process.argv[2];

Course.loadFromFile(filename).then(course => {
    console.log(course);
    console.log(course.asJSON());
  });
