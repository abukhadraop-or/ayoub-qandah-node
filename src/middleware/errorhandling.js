/**
 * Global ErrorHandler Classes.
 */
// eslint-disable-next-line max-classes-per-file
class error {
  constructor(msg, code) {
    this.msg = msg;
    this.code = code;
  }
}

class NotFound extends error {
  constructor(msg, code) {
    super((msg = "Not Found!"), (code = 404));
    this.hint = "Try to sure the link and method are correct.";
  }
}
class SignupError extends error {
  constructor(msg, hint) {
    super(msg);
    this.code = 500;
    this.hint = hint;
    this.type = "Signup Error!";
  }
}
class AuthError extends error {
  constructor(msg, hint) {
    super(msg);
    this.code = 500;
    this.hint = hint;
    this.type = "Login Error!";
  }
}
class InternalError extends error {
  constructor(msg, code) {
    super((msg = "Internal Error!"), (code = 500));
  }
}
class InvalidValues extends error {
  constructor(msg, code) {
    super(msg, (code = 500));
  }
}
class CommentError extends error {
  constructor(msg, code) {
    super(msg, (code = 502));
    msg = this.msg;
    this.type = "Comment Error!";
  }
}

class ArticleError extends error {
  constructor(msg, code) {
    super(msg, (code = 502));
    msg = this.msg;
    this.type = "Article Error!";
  }
}

class TagError extends error {
  constructor(msg, code) {
    super(msg, (code = 502));
    msg = this.msg;
    this.type = "Tag Error!";
  }
}

module.exports = {
  NotFound,
  TagError,
  AuthError,
  SignupError,
  CommentError,
  ArticleError,
  InvalidValues,
  InternalError,
};
