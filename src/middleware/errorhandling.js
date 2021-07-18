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
