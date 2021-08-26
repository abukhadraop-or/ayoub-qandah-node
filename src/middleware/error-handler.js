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
class DatabaseErr extends BaseError {
  constructor(msg, hint) {
    super(msg);
    this.code = 501;
    this.hint = hint;
    this.type = 'Fetching Error !';
  }
}
class Validation extends BaseError {
  constructor(msg, hint) {
    super(msg);
    this.code = 400;
    this.hint = hint;
    this.type = 'Fetching Error !';
  }
}

class InternalError extends BaseError {
  constructor(msg, code) {
    super((msg = 'Not Found!'), (code = 500));
    this.hint = 'Try to sure the link and method are correct.';
  }
}

module.exports = {
  NotFound,
  Validation,
  DatabaseErr,
  InternalError,
};
