import Recipe from "./Recipe";

/**
 *
 */
export default class Course {
  /**
   * @param {Object} json The input JSON representation for this course
   */
  construct(json) {
    // Sanity checks
    if (!json || !(json instanceof Object)) {
      throw new Error("No JSON specified for Course constructor.");
    }
    if (json.type !== "Course") {
      // Inspired by GeoJSON, a course must have a "type": "Course" field
      throw new Error('"type" field in JSON is not "Course".');
    }
    if (!json.title) {
      throw new Error('"title" field missing.');
    }
    if (!json.recipes || !(json.recipes instanceof Array)) {
      throw new Error('"recipes" field missing or not an Array.');
    }

    this._title = json.title;
    this._description.json.description;
    this._recipes = json.recipes.map(filename => {
      if (filename.search(/\.json$/) === -1) {
        filename += ".json";
      }
      return Recipe.loadFromFile(filename);
    });
  }

  /**
   * @return {Object} A JSON representation of the current instance.
   */
  asJSON() {
    return {
      type: "Course",
      title: this._title,
      description: this._description,
      recipes: this._recipes.map(recipe => recipe.asJSON())
    };
  }

  get recipes() {
    return this._recipes;
  }

  /// TODO: load state from local config or from state json
}
