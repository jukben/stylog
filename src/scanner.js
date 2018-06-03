const TOKEN = {
  STYLE_BLOCK_START: "{",
  STYLE_NAME_DELIMITER: " ",
  STYLE_BLOCK_END: "}",
  ESCAPE_CHAR: "\\"
};

const STATE = {
  INIT: Symbol("INIT"),
  TEXT: Symbol("TEXT"),
  IGNORE: Symbol("IGNORE"),
  STYLE_BLOCK_ID: Symbol("STYLE_BLOCK_ID"),
  STYLE_BLOCK_TEXT: Symbol("STYLE_BLOCK_TEXT"),
  STYLE_BLOCK_START: Symbol("STYLE_BLOCK_START"),
  STYLE_BLOCK_END: Symbol("STYLE_BLOCK_END")
};

export const TYPE = {
  END_OF_FILE: "END_OF_FILE",
  STYLE_BLOCK_START: "STYLE_BLOCK_START",
  STYLE_BLOCK_ID: "STYLE_BLOCK_ID",
  STYLE_BLOCK_TEXT: "STYLE_BLOCK_TEXT",
  STYLE_BLOCK_END: "STYLE_BLOCK_END",
  TEXT: "TEXT"
};

let lex = "";

// helper functions

function clearLex() {
  lex = "";
}

function addTokenToLex(token) {
  lex += token;
}

// non-deterministic finite automaton

function* scanner(input) {
  let i = 0;
  let state = STATE.INIT;
  clearLex();

  while (true) {
    const token = input[i++];

    if (token === undefined) {
      if (state === STATE.TEXT && lex) {
        yield { type: TYPE.TEXT, lex };
      }

      if (state === STATE.STYLE_BLOCK_TEXT && lex) {
        yield { type: TYPE.STYLE_BLOCK_TEXT, lex };
      }

      return { type: TYPE.END_OF_FILE };
    }

    switch (state) {
      case STATE.INIT: {
        if (token === TOKEN.STYLE_BLOCK_START) {
          state = STATE.STYLE_BLOCK_ID;
          yield { type: TYPE.STYLE_BLOCK_START };
          continue;
        } else if (token === TOKEN.ESCAPE_CHAR) {
          state = STATE.IGNORE;
          continue;
        } else {
          state = STATE.TEXT;
          addTokenToLex(token);
          continue;
        }
      }
      case STATE.TEXT: {
        if (token === TOKEN.STYLE_BLOCK_START) {
          state = STATE.STYLE_BLOCK_ID;

          yield { type: TYPE.TEXT, lex };
          yield { type: TYPE.STYLE_BLOCK_START };

          clearLex();
          continue;
        }

        if (token === TOKEN.ESCAPE_CHAR) {
          state = STATE.IGNORE;
          continue;
        }

        addTokenToLex(token);
        continue;
      }
      case STATE.IGNORE: {
        state = STATE.TEXT;
        lex += token;
        continue;
      }
      case STATE.STYLE_BLOCK_ID: {
        if (token === TOKEN.STYLE_NAME_DELIMITER) {
          state = STATE.STYLE_BLOCK_TEXT;

          yield { type: TYPE.STYLE_BLOCK_ID, lex };

          clearLex();
          continue;
        }

        if (token === TOKEN.STYLE_BLOCK_END) {
          state = STATE.TEXT;

          yield { type: TYPE.STYLE_BLOCK_ID, lex };
          yield { type: TYPE.STYLE_BLOCK_END };

          clearLex();
          continue;
        }

        if (token.match(/\s/)) {
          state = STATE.STYLE_BLOCK_TEXT;

          yield { type: TYPE.STYLE_BLOCK_ID, lex };

          clearLex();
          continue;
        }

        lex += token;
        continue;
      }
      case STATE.STYLE_BLOCK_TEXT: {
        if (token === TOKEN.STYLE_BLOCK_END) {
          state = STATE.INIT;

          yield { type: TYPE.STYLE_BLOCK_TEXT, lex };
          yield { type: TYPE.STYLE_BLOCK_END };

          clearLex();
          continue;
        }

        addTokenToLex(token);
        continue;
      }
    }
  }
}

export default scanner;
