import parser from "../parser";

describe("parser", () => {
  it("text", () => {
    expect(parser("text")).toEqual([
      {
        type: "TEXT",
        value: "text"
      }
    ]);
  });

  it("styled", () => {
    expect(parser("text {styled text}")).toEqual([
      {
        type: "TEXT",
        value: "text "
      },
      {
        type: "STYLED",
        value: "text",
        id: "styled"
      }
    ]);
  });

  it("styled without text", () => {
    expect(parser("text {styled}")).toEqual([
      {
        type: "TEXT",
        value: "text "
      },
      {
        type: "STYLED",
        id: "styled",
        value: null
      }
    ]);
  });

  it("styled advanced", () => {
    expect(parser("text {image} swag")).toEqual([
      {
        type: "TEXT",
        value: "text "
      },
      {
        type: "STYLED",
        id: "image",
        value: null
      },
      {
        type: "TEXT",
        value: " swag"
      }
    ]);
  });

  it("styled advanced, styled object has to have lex", () => {
    expect(() => parser("text {} swag")).toThrowError(/lex/);
  });

  it("styled advanced unexpected end of the recipe", () => {
    expect(() => parser("text {")).toThrowError(/Unexpected/);
  });

  it("unexpected end of the recipe", () => {
    expect(() => parser("")).toThrowError(/Unexpected/);
  });

  it("styled advanced unexpected end of the recipe", () => {
    expect(() => parser("")).toThrowError(/Unexpected/);
  });

  it("styled advanced unexpected end of the recipe in text of styled object", () => {
    expect(() => parser("{i ")).toThrowError(/Unexpected/);
  });

  it("styled advanced unexpected end of the recipe", () => {
    expect(() => parser("{i ")).toThrowError(/Unexpected/);
  });

  it("styled advanced unexpected end of the recipe", () => {
    expect(() => parser("{i d")).toThrowError(/Unexpected/);
  });
});
