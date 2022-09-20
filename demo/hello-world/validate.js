const Ajv = require("ajv");

const petsSchema = {
    type: "object",
    properties: {
    baseUrl: {type: "string", minLength: 1, maxLength: 300},
    myPets: {type: "array", minItems:1,
            items: {type: "object", required: ["uuid"]}},
    uuid:{type: "string", minLength: 1, maxLength: 50},
    },
    required: ["baseUrl", "myPets"],
};

const recipeSchema = {
    type: "object",
    properties: {
      recipes: {type: "array", minItems:1}
    },
    required: ["recipes"],
  }
const ajv = new Ajv({allErrors:true})

const ValidateRecipes = (body) => {
    const validate = ajv.compile(recipeSchema)
    const valid = validate(body);
    return valid;
};

const ValidatePets = (body) => {
    const validate = ajv.compile(petsSchema)
    const valid = validate(body);
    return valid;
};
module.exports = {ValidateRecipes, ValidatePets};
