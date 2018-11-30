import Course from '../lib/parsers/Course';

const filename = process.argv[2];

Course.loadFromFile(filename).then(course => {
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
