import scanner from "../scanner";

describe("scanner", () => {
  it("is and array", () =>
    expect(
      Array.isArray([
        ...scanner(`this is 
text`)
      ])
    ).toBe(true));

  it("simple online line text", () =>
    expect([...scanner(`this is text`)]).toEqual([
      {
        type: "TEXT",
        lex: `this is text`
      }
    ]));

  it("multiline text with style object", () =>
    expect([
      ...scanner(`this is
{swag mine
swag}
{image}
text`)
    ]).toEqual([
      {
        type: "TEXT",
        lex: `this is
`
      },
      {
        type: "STYLE_BLOCK_START"
      },
      {
        type: "STYLE_BLOCK_ID",
        lex: `swag`
      },
      {
        type: "STYLE_BLOCK_TEXT",
        lex: `mine
swag`
      },
      {
        type: "STYLE_BLOCK_END"
      },
      {
        type: "TEXT",
        lex: `
`
      },
      {
        type: "STYLE_BLOCK_START"
      },
      {
        type: "STYLE_BLOCK_ID",
        lex: `image`
      },
      {
        type: "STYLE_BLOCK_END"
      },
      {
        type: "TEXT",
        lex: `
text`
      }
    ]));

  it("multiline text with style object with white-char", () =>
    expect([
      ...scanner(`text{s
d enhanced}`)
    ]).toEqual([
      {
        type: "TEXT",
        lex: `text`
      },
      {
        type: "STYLE_BLOCK_START"
      },
      {
        type: "STYLE_BLOCK_ID",
        lex: `s`
      },
      {
        type: "STYLE_BLOCK_TEXT",
        lex: `d enhanced`
      },
      {
        type: "STYLE_BLOCK_END"
      }
    ]));

  it("multiline text with style object without id", () =>
    expect([
      ...scanner(`text{
d enhanced
a}`)
    ]).toEqual([
      {
        type: "TEXT",
        lex: `text`
      },
      {
        type: "STYLE_BLOCK_START"
      },
      {
        type: "STYLE_BLOCK_ID",
        lex: ``
      },
      {
        type: "STYLE_BLOCK_TEXT",
        lex: `d enhanced
a`
      },
      {
        type: "STYLE_BLOCK_END"
      }
    ]));

  it("single line with escaped style object", () =>
    expect([...scanner(`this is not a \\{style object}`)]).toEqual([
      {
        type: "TEXT",
        lex: `this is not a {style object}`
      }
    ]));

  it("single line with escaped style object", () =>
    expect([...scanner(`\\{s styled}`)]).toEqual([
      {
        type: "TEXT",
        lex: `{s styled}`
      }
    ]));

  it("single line with style object", () =>
    expect([...scanner(`{s styled}`)]).toEqual([
      {
        type: "STYLE_BLOCK_START"
      },
      {
        type: "STYLE_BLOCK_ID",
        lex: `s`
      },
      {
        type: "STYLE_BLOCK_TEXT",
        lex: `styled`
      },
      {
        type: "STYLE_BLOCK_END"
      }
    ]));

  it("single line with }", () =>
    expect([...scanner(`styled}`)]).toEqual([
      {
        type: "TEXT",
        lex: "styled}"
      }
    ]));

  it("single line with styled non-terminated object", () =>
    expect([...scanner(`non terminated {style object`)]).toEqual([
      {
        type: "TEXT",
        lex: "non terminated "
      },
      {
        type: "STYLE_BLOCK_START"
      },
      {
        type: "STYLE_BLOCK_ID",
        lex: "style"
      },
      {
        type: "STYLE_BLOCK_TEXT",
        lex: "object"
      }
    ]));

  it("single line with styled non-terminated object", () =>
    expect([
      ...scanner(`text {styled text}
swag`)
    ]).toEqual([
      {
        type: "TEXT",
        lex: "text "
      },
      {
        type: "STYLE_BLOCK_START"
      },
      {
        type: "STYLE_BLOCK_ID",
        lex: "styled"
      },
      {
        type: "STYLE_BLOCK_TEXT",
        lex: `text`
      },
      {
        type: "STYLE_BLOCK_END"
      },
      {
        type: "TEXT",
        lex: `
swag`
      }
    ]));
});
