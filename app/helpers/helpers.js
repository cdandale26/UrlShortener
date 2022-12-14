const moment = require("moment");
const shortHash = require("short-hash");

const urlValidator = (value) => {
  const linkRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return linkRegex.test(value);
};

const createShort = (value) => {
  try {
    if (urlValidator(value)) {
      return shortHash(value);
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createShort };
