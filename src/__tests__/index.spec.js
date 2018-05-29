import styled from "../index";

const styledConsole = jest.spyOn(global.console, "log");

describe("styled", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("text", () => {
    styled(`text`);
    expect(styledConsole).toHaveBeenCalledWith("text");
  });

  it("styled", () => {
    styled(`text {styled text}`, { styled: { color: "red" } });
    expect(styledConsole).toHaveBeenCalledWith("text %ctext", "color:red");
  });

  it("styled advanced", () => {
    styled(
      `text {styled text}
swag`,
      { styled: { color: "red" } }
    );
    expect(styledConsole).toHaveBeenCalledWith(
      `text %ctext
swag`,
      "color:red"
    );
  });

  it("styled advanced multiple", () => {
    styled(
      `text {styled text}
swag{underline double-swag}`,
      { styled: { color: "red" }, underline: { textDecoration: "underline" } }
    );
    expect(styledConsole).toHaveBeenCalledWith(
      `text %ctext
swag%cdouble-swag`,
      "color:red",
      "text-decoration:underline"
    );
  });

  it("styled advanced multiple", () => {
    styled(
      `text {styled text}
swag{underline double-swag}`
    );
    expect(styledConsole).toHaveBeenCalledWith(
      `text text
swagdouble-swag`
    );
  });

  it("styled advanced without style object", () => {
    expect(() =>
      styled(
        `text {styled text}
swag`,
        {}
      )
    ).toThrow(/Style for "styled" d/);
  });
});
