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

function styled(recipe, stylesDictionary = null) {
  const parsedRecipe = parser(recipe);
  const [text, styles] = parsedRecipe.reduce(
    (config, currentValue, currentIndex, array) => {
      const { type, value, id } = currentValue;

      switch (type) {
        case PARSER_TYPE.TEXT: {
          config[0] += value;
          break;
        }
        case PARSER_TYPE.STYLED: {
          if (!stylesDictionary) {
            config[0] += value;
            break;
          }

          config[0] += `%c${value}`;

          const style = stylesDictionary[id];
          if (!style) {
            throw new Error(`Style for "${id}" doesn't found`);
          }

          config[1].push(convertStyleObjectToString(style));
          break;
        }
        default:
          throw new Error("Unrecognized type");
      }

      return config;
    },
    ["", []]
  );

  console.log(text, ...styles);
}

export default styled;
