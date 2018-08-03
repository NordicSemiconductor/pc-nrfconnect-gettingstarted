import sander from "sander";
import Checkable from "./Checkable";
import appliesToRunningPlatform from "./platform-check";
import path from "path";

/**
 * A Recipe is a set of things that should get one tool installed to a known
 * state.
 */
export default class Recipe {
  /**
   * @param {Object} json The input JSON representation for this recipe
   */
  constructor(inputJson) {
    let json = inputJson;

    // Sanity checks
    if (json instanceof String) {
      // Assume that a string is really a recipe for all platforms
      json = { platforms: "all", url: json };
    }
    if (!json || !(json instanceof Object)) {
      throw new Error("No JSON specified for Recipe constructor.");
    }
    if (json.type !== "Recipe") {
      // Inspired by GeoJSON, a course must have a "type": "Recipe" field
      throw new Error('"type" field in JSON is not "Recipe".');
    }
    if (!json.tool || typeof json.tool !== "string") {
      throw new Error('"tool" field must be a string.');
    }

    this._enabled = appliesToRunningPlatform(json.platforms);
    this._platforms = json.platforms;

    // Using indexOf() instead of slice() to split name/semver, because the
    // semver part can have hyphens too.
    const hypenPosition = json.tool.indexOf("-");
    if (hypenPosition === -1) {
      throw new Error('"tool" field is malformed.');
    }
    this._toolName = json.tool.substring(0, hypenPosition);
    this._toolSemver = json.tool.substring(hypenPosition + 1);

    this._title = json.title;
    this._description = json.description;
    //     this._recipes = json.recipes.map(recipeJson => new Recipe(recipeJson));

    /// TODO: Decide whether to stick with this name or change it.
    if (!json.checkables || !(json.checkables instanceof Array)) {
      throw new Error('"checkables" field missing or not an Array.');
    }
    this._checkables = json.checkables.map(
      checkable => new Checkable(checkable)
    );
  }

  /**
   * Loads a .json file from the filesystem, parses it, and returns an instance
   * of Recipe from it.
   *
   * @param {String} filename Relative path of the file to load
   * @returns {Promise<Recipe>} A Promise to an instance of Recipe
   */
  static loadFromFile(filename) {
    return sander.readFile(filename, { encoding: "utf8" }).then(text => {
      let json;
      try {
        json = JSON.parse(text);
      } catch (ex) {
        throw new Error(
          "File " + filename + " failed to be parsed as JSON: " + ex
        );
      }

      if (json.tool !== path.basename(filename).replace(/\.json$/, "")) {
        throw new Error(
          '"tool" field doesn\'t match filename: ' + json.tool + "vs" + filename
        );
      }
      return new Recipe(json);
    });
  }

  /**
   * @return {Object} A JSON representation of the current instance.
   */
  asJSON() {
    return {
      type: "Recipe",
      title: this._title,
      tool: this._toolName + "-" + this._toolSemver,
      platforms: this._platforms,
      description: this._description,
      checkables: this._checkables.map(checkable => checkable.asJSON())
      //       recipes: this._recipes.map(recipe => recipe.asJSON())
    };
  }

  get checkables() {
    return this._checkables;
  }

  get enabled() {
    return this._enabled;
  }

  /// TODO: load state from local config or from state json
}
