import parser, { TYPE as PARSER_TYPE } from "./parser";

/**
 * Convert CSS-like style object notation to string
 *
 * Example:
 *
 * convertStyleObjectToString({
 *   fontSize: "20px"
 * }) === "font-size:20;"
 *
 * Numbers are taken as dimensions in pixels
 */
function convertStyleObjectToString(styleObject) {
  return Object.entries(styleObject)
    .map(([rule, value]) => {
      return `${rule
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase()}:${Number.isInteger(value) ? `${value}px` : value}`;
    })
    .join(";");
}

/**
 * Call of this function will affect actual console.log call as a side-effect
 *
 * Example:
 *
 * styled("text {styled styled text}", {styled: {fontSize: 20}});
 */
function styled(recipe, stylesDictionary, mapperDictionary) {
  const parsedRecipe = parser(recipe);
  const [texts, styles] = parsedRecipe.reduce(
    (config, currentValue, currentIndex, array) => {
      const { type, value, id } = currentValue;

      let text = value || " ";
      let style = "";

      if (!stylesDictionary && !mapperDictionary) {
        config[0] += text;
        return config;
      }

      if (type === PARSER_TYPE.STYLED) {
        const textMapper = mapperDictionary && mapperDictionary[id];
        if (textMapper) {
          try {
            text = textMapper(value) || " ";
          } catch (e) {
            text = " ";
            throw new Error(
              `Text mapper for "${id}" has thrown an error: ${e.message}`
            );
          }
        }

        const styleObject = stylesDictionary && stylesDictionary[id];
        if (styleObject) {
          style = convertStyleObjectToString(styleObject);
        }
      }

      // concat text
      config[0] += `%c${text}`;
      // add new style
      config[1].push(style);
      return config;
    },
    ["", []]
  );

  console.log(texts, ...styles);
}

/**
 * Curried version of "styled" function with reversed order of arguments (data-last)
 *
 * Example:
 *
 * const superConsole = styled.fp(null)({ big: { fontSize: "20px" } });
 * superConsole("{big text}");
 */
styled.fp = (...arg) => {
  return (...x) => {
    const args = [...arg, ...x];

    if (args.length === styled.length) {
      return styled.apply(this, args.reverse());
    }

    return styled.fp(args);
  };
};

export default styled;
