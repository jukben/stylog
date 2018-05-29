import scanner from "./scanner";

const TYPE2 = {
  TEXT: "TEXT",
  STYLED: "STYLED"
};

const TYPE = {
  END_OF_FILE: "END_OF_FILE",
  STYLE_BLOCK_START: "STYLE_BLOCK_START",
  STYLE_BLOCK_ID: "STYLE_BLOCK_ID",
  STYLE_BLOCK_TEXT: "STYLE_BLOCK_TEXT",
  STYLE_BLOCK_END: "STYLE_BLOCK_END",
  TEXT: "TEXT"
};

/**
    * -> Text
    * -> Styled
    Text -> Text Styled
    Styled -> StyledStart StyledID StyledText StyledEnd
    Styled -> StyledStart StyledID StyledEnd
 */

let stack = null;
let tokenGenerator = null;

function createText(value) {
  stack.push({
    type: TYPE2.TEXT,
    value
  });
}

function createStyled({ id, value = null }) {
  stack.push({
    type: TYPE2.STYLED,
    value,
    id
  });
}

function parser(input) {
  stack = [];
  tokenGenerator = scanner(input);

  return Init();
}

function Init() {
  const {
    value: { type, lex }
  } = tokenGenerator.next();

  if (type === TYPE.TEXT) {
    createText(lex);

    return Text();
  }

  throw new SyntaxError(`Unexpected token: ${type}`);
}

function StyledID() {
  const {
    value: { type, lex: id },
    done
  } = tokenGenerator.next();

  if (type === TYPE.STYLE_BLOCK_ID) {
    if (!id) {
      throw new SyntaxError(
        `Unexpected token: ${type}. Token has to have lex.`
      );
    }

    return StyledText({
      id
    });
  }

  throw new SyntaxError(`Unexpected token: ${type}`);
}

function StyledText(styledObject) {
  const {
    value: { type, lex: value },
    done
  } = tokenGenerator.next();

  if (type === TYPE.STYLE_BLOCK_TEXT) {
    return StyledEnd({
      value,
      ...styledObject
    });
  }

  if (type === TYPE.STYLE_BLOCK_END) {
    createStyled({
      ...styledObject
    });

    return Text();
  }

  throw new SyntaxError(`Unexpected token: ${type}`);
}

function StyledEnd(styledObject) {
  const {
    value: { type, lex },
    done
  } = tokenGenerator.next();

  if (type === TYPE.STYLE_BLOCK_END) {
    createStyled({
      ...styledObject
    });

    return Text();
  }

  throw new SyntaxError(`Unexpected token: ${type}`);
}

function Text() {
  const {
    value: { type, lex },
    done
  } = tokenGenerator.next();

  if (type === TYPE.END_OF_FILE) {
    return stack;
  }

  if (type === TYPE.STYLE_BLOCK_START) {
    return StyledID();
  }

  if (type === TYPE.TEXT) {
    return Text();
  }

  throw new SyntaxError(`Unexpected token: ${type}`);
}

export default parser;
