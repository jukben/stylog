import scanner, { TYPE as SCANNER_TYPE } from "./scanner";

export const TYPE = {
  TEXT: "TEXT",
  STYLED: "STYLED"
};

let ast = [];
let tokenGenerator = null;

//  helpers functions

function createText(value) {
  ast.push({
    type: TYPE.TEXT,
    value
  });
}

function createStyled({ id, value = null }) {
  ast.push({
    type: TYPE.STYLED,
    value,
    id
  });
}

function getNextToken() {
  const {
    value: { type, lex }
  } = tokenGenerator.next();

  return { type, lex };
}

// Rules

function Init() {
  const { type, lex } = getNextToken();

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
  const { type, lex: id } = getNextToken();

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
  const { type, lex: value } = getNextToken();

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
  const { type, lex } = getNextToken();

  if (type === SCANNER_TYPE.STYLE_BLOCK_END) {
    createStyled({
      ...styledObject
    });
    return Text();
  }

  throw new SyntaxError(`Unexpected token: ${type}`);
}

function Text() {
  const { type, lex } = getNextToken();

  if (type === SCANNER_TYPE.STYLE_BLOCK_START) {
    return StyledID();
  }

  if (type === SCANNER_TYPE.TEXT) {
    createText(lex);

    return Text();
  }

  return ast;
}

function parser(input) {
  ast = [];
  tokenGenerator = scanner(input);

  return Init();
}

export default parser;
