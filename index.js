const STYLE_BLOCK_START = "{";
const STYLE_NAME_DELIMITER = " ";
const STYLE_BLOCK_END = "}";
const ESCAPE_CHAR = "\\";
const TEXT = "TEXT";

const STATE = {
  INIT: Symbol("INIT"),
  TEXT: Symbol("TEXT"),
  IGNORE: Symbol("IGNORE"),
  STYLE_BLOCK: Symbol("STYLE_BLOCK"),
  STYLE_BLOCK_ID: Symbol("STYLE_BLOCK_ID"),
  STYLE_BLOCK_TEXT: Symbol("STYLE_BLOCK_TEXT"),
  STYLE_BLOCK_START: Symbol("STYLE_BLOCK_START"),
  STYLE_BLOCK_END: Symbol("STYLE_BLOCK_END"),
  STYLE_BLOCK_ID_DELIMITER: Symbol("STYLE_BLOCK_ID_DELIMITER"),
  IGNORE: Symbol("IGNORE")
};

function* scanner(input) {
  let i = 0;
  let state = STATE.INIT;
  let lex = "";

  while (true) {
    const token = input[i++];

    if (token === undefined) {
      if (state === STATE.TEXT) {
        yield { type: TEXT, lex };
      }

      return "END_OF_FILE";
    }

    switch (state) {
      case STATE.INIT: {
        if (token === STYLE_BLOCK_START) {
          state = STATE.STYLE_BLOCK_ID;
          yield { type: "STYLE_BLOCK_END" };
          continue;
        } else if (token === STYLE_BLOCK_END) {
          yield { type: "STYLE_BLOCK_END" };
          continue;
        } else if (token === ESCAPE_CHAR) {
          state = STATE.IGNORE;
          continue;
        } else {
          state = STATE.TEXT;
          lex += token;
          continue;
        }
      }
      case STATE.TEXT: {
        if (token === STYLE_BLOCK_START) {
          state = STATE.STYLE_BLOCK_ID;

          yield { type: TEXT, lex };
          yield { type: "STYLE_BLOCK_START" };

          lex = "";
          continue;
        }

        if (token === ESCAPE_CHAR) {
          state = STATE.IGNORE;
          continue;
        }

        lex += token;
        continue;
      }
      case STATE.IGNORE: {
        state = STATE.TEXT;
        lex += token;
        continue;
      }
      case STATE.STYLE_BLOCK_ID: {
        if (token === STYLE_NAME_DELIMITER) {
          state = STATE.STYLE_BLOCK_TEXT;
          yield { type: "STYLE_BLOCK_ID", lex };
          lex = "";
          continue;
        }

        if (token === STYLE_BLOCK_END) {
          state = STATE.TEXT;
          yield { type: "STYLE_BLOCK_ID", lex };
          yield { type: "STYLE_BLOCK_END" };

          lex = "";
          continue;
        }

        if (token.match(/\s/)) {
          state = STATE.STYLE_BLOCK_TEXT;
          yield { type: "STYLE_BLOCK_ID", lex };
          lex = "";
          continue;
        }

        lex += token;
        continue;
      }
      case STATE.STYLE_BLOCK_TEXT: {
        if (token === STYLE_BLOCK_END) {
          state = STATE.INIT;
          yield { type: "STYLE_BLOCK_TEXT", lex };
          yield { type: "STYLE_BLOCK_END" };
          lex = "";
          continue;
        }

        lex += token;
        continue;
      }
      default: {
        throw new Error("Unspecified state! " + state.toString());
      }
    }
  }
}

module.exports = scanner;
