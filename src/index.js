import parser, { TYPE as PARSER_TYPE } from "./parser";

function convertStyleObjectToString(styleObject) {
  return Object.entries(styleObject)
    .map(([rule, value]) => {
      return `${rule
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase()}:${value}`;
    })
    .join(";");
}

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

export default styled;
