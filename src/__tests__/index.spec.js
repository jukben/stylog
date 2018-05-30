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
    expect(styledConsole).toHaveBeenCalledWith(
      "%ctext %ctext",
      "",
      "color:red"
    );
  });

  it("styled advanced", () => {
    styled(
      `text {styled text}
  swag`,
      { styled: { color: "red" } }
    );
    expect(styledConsole).toHaveBeenCalledWith(
      `%ctext %ctext%c
  swag`,
      "",
      "color:red",
      ""
    );
  });

  it("styled advanced multiple", () => {
    styled(
      `text {styled text}
  swag{underline double-swag}`,
      { styled: { color: "red" }, underline: { textDecoration: "underline" } }
    );
    expect(styledConsole).toHaveBeenCalledWith(
      `%ctext %ctext%c
  swag%cdouble-swag`,
      "",
      "color:red",
      "",
      "text-decoration:underline"
    );
  });

  it("styled advanced multiple without style object", () => {
    styled(
      `text {styled text}
swag{underline double-swag}`
    );
    expect(styledConsole).toHaveBeenCalledWith(
      `text text
swagdouble-swag`
    );
  });

  it("styled advanced multiple another", () => {
    styled(
      `{big Hello this is styled text}
  and this is not`,
      { big: { fontSize: "20px" } }
    );
    expect(styledConsole).toHaveBeenCalledWith(
      `%cHello this is styled text%c
  and this is not`,
      "font-size:20px",
      ""
    );
  });

  it("styled advanced multiple", () => {
    styled(`text and {image}`, { image: { fontSize: "20px" } });
    expect(styledConsole).toHaveBeenCalledWith(
      `%ctext and %c `,
      "",
      "font-size:20px"
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
