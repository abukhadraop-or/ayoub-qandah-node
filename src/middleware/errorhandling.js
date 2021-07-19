// eslint-disable-next-line max-classes-per-file
class error {
  constructor(msg, code) {
    this.msg = msg;
    this.code = code;
  }
}

class notFound extends error {
  constructor(msg, code) {
    super((msg = "Not Found!"), (code = 404));
    this.hint = "Try to sure the link and method are correct.";
  }
}
class signupError extends error {
  constructor(msg, hint) {
    super(msg);
    this.code = 500;
    this.hint = hint;
    this.type = "Signup Error!";
  }
}
class authError extends error {
  constructor(msg, hint) {
    super(msg);
    this.code = 500;
    this.hint = hint;
    this.type = "Login Error!";
  }
}
class internalError extends error {
  constructor(msg, code) {
    super((msg = "Internal Error!"), (code = 500));
  }
}
class invalidValues extends error {
  constructor(msg, code) {
    super(msg, (code = 500));
  }
}
class commentError extends error {
  constructor(msg, code) {
    super(msg, (code = 502));
    msg = this.msg;
    this.type = "Comment Error!";
  }
}

class articleError extends error {
  constructor(msg, code) {
    super(msg, (code = 502));
    msg = this.msg;
    this.type = "Article Error!";
  }
}

class tagError extends error{
  constructor(msg, code) {
    super(msg, (code = 502));
    msg = this.msg;
    this.type = "Tag Error!";
  }
}

module.exports = {
  notFound,
  tagError,
  authError,
  signupError,
  commentError,
  articleError,
  invalidValues,
  internalError,
};
