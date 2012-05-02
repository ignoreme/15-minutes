exports.valid_id = make_validator('id', /^[a-zA-Z0-9_\-]+$/);
exports.valid_name = make_validator('name', /^.+$/);
exports.valid_sex = make_validator('sex', /^[mf]$/);
exports.valid_dateofbirth = make_validator('dateofbirth', /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
exports.valid_deviceid = make_validator('deviceid');

function make_validator(property, pattern) {
  return function validate(req) {
    if ( !req.params[property] ) {
      return [false, property + " not found"];
    }
    if ( pattern && !req.params[property].match(pattern) ) {
      return [false, "Invalid " + property + " " + req.params[property]];
    }
    return [true, "OK"];
  }
}
