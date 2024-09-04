import SimpleReactValidator from "simple-react-validator";

const validator = new SimpleReactValidator({
  autoForceUpdate: this,
  validators: {
    minLowercase: {
      message: "The :attribute must contain at least :minLowercase lowercase letter.",
      rule: (val, params, validator) => validator.helpers.testRegex(val, /[a-z]/) && val.length >= params[0],
    },
    minUppercase: {
      message: "The :attribute must contain at least :minUppercase uppercase letter.",
      rule: (val, params, validator) => validator.helpers.testRegex(val, /[A-Z]/) && val.length >= params[0],
    },
    minNumbers: {
      message: "The :attribute must contain at least :minNumbers number.",
      rule: (val, params, validator) => validator.helpers.testRegex(val, /\d/) && val.length >= params[0],
    },
    minSymbols: {
      message: "The :attribute must contain at least :minSymbols special character.",
      rule: (val, params, validator) => validator.helpers.testRegex(val, /[@$!%*?&]/) && val.length >= params[0],
    },
    validUsername: {
      message: "The :attribute must be between 5 and 50 characters, include at least one lowercase letter, one number, and one special character (@, ., _, -).",
      rule: (val) => /^(?=.*[a-z])(?=.*\d)(?=.*[@._-])[A-Za-z\d@._-]{5,50}$/.test(val),
    },

    greaterThanZero: {
      message: "The :attribute must be a number greater than 0.",
      rule: (val) => !isNaN(val) && Number(val) > 0,
      required: true,
    },
  },
  messages: {
    required: "This field is required.",
    min: "The :attribute must be at least :min characters.",
    max: "The :attribute cannot exceed :max characters.",
  },
});
export const validateNumber = (number) => {
  const rules = "required|greaterThanZero";
  return validator.message("number", number, rules);
};

export const validatePassword = (password) => {
  const rules = "required|min:6|max:20|minLowercase:1|minUppercase:1|minNumbers:1|minSymbols:1";
  return validator.message("password", password, rules);
};

export const validateUsername = (username) => {
  const rules = "required|validUsername";
  return validator.message("username", username, rules);
};

export const validateField = (field, value, rules) => {
  return validator.message(field, value, rules);
};

// Validate all fields in the form
export const validateForm = () => {
  return validator.allValid();
};

// Show validation messages
export const showValidationMessages = () => {
  validator.showMessages();
};
