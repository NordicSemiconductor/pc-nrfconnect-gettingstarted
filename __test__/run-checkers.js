// const util = require('util');
// const Course = require('../parsers');
import util from 'util';
import Course from '../lib/parsers';

const filename = process.argv[2];

Course.loadFromFile(filename).then(course => {
//     console.log(course);
//     console.log(util.inspect(course, {depth: 6}));
//     console.log(util.inspect(course.asJSON(), { depth: null }));

    let queue = Promise.resolve();

    for (const recipe of course.recipes) {

        if (recipe.enabled) {

            console.log('Recipe: ', recipe.tool, recipe.title);

            for (const checkable of recipe.checkables) {
                console.log('Checkable: ', checkable.steps.map(step=>step.title) );

                console.log('isManual / checkers: ', checkable.isManual, checkable._checkers );

                if (!checkable.isManual) {

                    queue.then(checkable.runCheckers.bind(checkable)).then((out)=>{
                        console.log('Checkable for ', checkable.steps.map(step=>step.title), 'has finished. Checker result: ', out);
                    });

                }
            }

        }

    }

});
