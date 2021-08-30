/**
 * Global ErrorHandler Classes.
 */

// eslint-disable-next-line max-classes-per-file
class BaseError extends Error {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }
}

class NotFound extends BaseError {
  constructor(msg, code) {
    super((msg = 'Not Found!'), (code = 404));
    this.hint = 'Try to sure the link and method are correct.';
  }
}

class Validation extends BaseError {
  constructor(msg = 'Invalid request data or syntax!', hint) {
    super(msg);
    this.code = 400;
    this.msg = msg;
  }
}
class Authentication extends BaseError {
  constructor(msg = 'Unauthorized!', hint) {
    super(msg);
    this.code = 401;
  }
}

class InternalError extends BaseError {
  constructor(msg, code) {
    super((msg = 'Not Found!'), (code = 500));
  }
}

module.exports = {
  NotFound,
  Validation,
  Authentication,
  InternalError,
};
