const assertNever = (value: never): never => {
  throw new Error(`Unexpected value ${value}`);
};

type T = "a" | "b";

function fn1(v: T) {
  switch (v) {
    case "a":
      console.log(v);
      break;
    default:
      throw new Error(`Unexpected value ${v}`);
  }
}

function fn2(v: T) {
  switch (v) {
    case "a":
      console.log(v);
      break;
    case "b":
      console.log(v);
      break;
    default:
      assertNever(v);
  }
}
