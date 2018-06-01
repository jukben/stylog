import scanner, { TYPE as SCANNER_TYPE } from "./scanner";

export const TYPE = {
  TEXT: "TEXT",
  STYLED: "STYLED"
};

let stack = null;
let tokenGenerator = null;

function createText(value) {
  stack.push({
    type: TYPE.TEXT,
    value
  });
}

function createStyled({ id, value = null }) {
  stack.push({
    type: TYPE.STYLED,
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

  if (type === SCANNER_TYPE.TEXT) {
    createText(lex);

    return Text();
  }

  if (type === SCANNER_TYPE.STYLE_BLOCK_START) {
    return StyledID();
  }

  throw new SyntaxError(`Unexpected token: ${type}`);
}

function StyledID() {
  const {
    value: { type, lex: id },
    done
  } = tokenGenerator.next();

  if (type === SCANNER_TYPE.STYLE_BLOCK_ID) {
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

  if (type === SCANNER_TYPE.STYLE_BLOCK_TEXT) {
    return StyledEnd({
      value,
      ...styledObject
    });
  }

  if (type === SCANNER_TYPE.STYLE_BLOCK_END) {
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

  if (type === SCANNER_TYPE.STYLE_BLOCK_END) {
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

  if (type === SCANNER_TYPE.STYLE_BLOCK_START) {
    return StyledID();
  }

  if (type === SCANNER_TYPE.TEXT) {
    createText(lex);

    return Text();
  }

  return stack;
}

export default parser;
