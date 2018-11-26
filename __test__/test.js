import path from 'path';
import Course from '../lib/parsers';

describe('Test Course Loader', () => {
    describe('loading courses', () => {
        it('throws error when course file does not exist', (done) => {
            Course.loadFromFile('non_existing_file').catch(err => {
                expect(err.message).toMatch(/^File non_existing_file failed to be parsed as JSON:/);
                done();
            });
        });

        it('loads a course with no recipes', (done) => {
            const filename = path.normalize('./__test__/data/course-1.json');
            const course = Course.loadFromFile(filename);

            course.then(data => {
                expect(data.type).toEqual('Course');
                expect(data.title).toEqual('A course with no recipes');
                expect(data.description).toEqual('This is just a stub for testing');
                expect(data.enabled).toEqual(true);
                expect(data.recipes.length).toBe(0);
                done();
            });
        });

        it('loads a course with a recipe', (done) => {
            const filename = path.normalize('./__test__/data/course-2.json');
            const course = Course.loadFromFile(filename);

            course.then(data => {
                expect(data.type).toEqual('Course');
                expect(data.title).toEqual('A course with one fake recipe');
                expect(data.description).toEqual('This is just a stub for testing, but includes one recipe');
                expect(data.enabled).toEqual(true);
                expect(data.recipes.length).toBe(1);
                done();
            });
        });

        it('filters steps not valid for the platform', (done) => {
            const filename = path.normalize('./__test__/data/course-2.json');
            const course = Course.loadFromFile(filename);

            course.then(data => {
                expect(data.recipes[0].checkables.length).toBe(2);
                expect(data.recipes[0].checkables[0].steps.length).toBe(3);
                expect(data.recipes[0].checkables[0].steps.filter(step => step.enabled).length).toBe(2);
                done();
            });
        });
    });
});
