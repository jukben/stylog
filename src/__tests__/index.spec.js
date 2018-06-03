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

  it("styled advanced multiple", () => {
    styled(`text and {image}`, { image: { fontSize: "20px" } });
    expect(styledConsole).toHaveBeenCalledWith(
      `%ctext and %c `,
      "",
      "font-size:20px"
    );
  });

  it("styled advanced multiple with text mutator", () => {
    styled(`text and {clap swag}`, null, {
      clap: s => {
        return [...s]
          .map((a, i) => `${a}${i !== s.length - 1 ? "👏" : ""}`)
          .join("");
      }
    });
    expect(styledConsole).toHaveBeenCalledWith(
      `%ctext and %cs👏w👏a👏g`,
      "",
      ""
    );
  });

  it("styled advanced multiple with text mutator which returns falsy", () => {
    styled(`text and {clap swag}`, null, {
      clap: s => false
    });
    expect(styledConsole).toHaveBeenCalledWith(`%ctext and %c `, "", "");
  });

  it("styled advanced multiple with text mutator which throw an error", () => {
    expect(() =>
      styled(`text and {clap swag}`, null, {
        clap: () => {
          throw new Error("swag");
        }
      })
    ).toThrowError(/for "clap" has thrown an error: swag/);
  });

  it("styled advanced without style object", () => {
    styled(`text {styled text}`, {});
    expect(styledConsole).toHaveBeenCalledWith(`%ctext %ctext`, "", "");
  });
});

describe("fp", () => {
  it("styled, curry 1", () => {
    const bigText = styled.fp(null, { big: { fontSize: 20 } });

    bigText("{big text}");

    expect(styledConsole).toHaveBeenCalledWith(`%ctext`, "font-size:20px");
  });

  it("styled, curry 2", () => {
    const bigTransform = styled.fp(null);
    const bigStyle = bigTransform({ big: { fontSize: "20px" } });

    bigStyle("{big text}");

    expect(styledConsole).toHaveBeenCalledWith(`%ctext`, "font-size:20px");
  });
});
