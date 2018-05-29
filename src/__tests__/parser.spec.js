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
});
