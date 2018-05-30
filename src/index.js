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

      if (!stylesDictionary) {
        config[0] += value;
        return config;
      }

      config[0] += `%c${value || " "}`;

      let style = "";

      if (type === PARSER_TYPE.STYLED) {
        const styleObject = stylesDictionary[id];
        if (!styleObject) {
          throw new Error(`Style for "${id}" doesn't found`);
        }

        style = convertStyleObjectToString(styleObject);
      }

      config[1].push(style);
      return config;
    },
    ["", []]
  );

  console.log(text, ...styles);
}

export default styled;
