import path from "path";
import fs from "fs";

export default {
  // rules: {
  // },
  rules: {
    "no-literal": {
      create: context => {
        console.log("running no-literal rule");
        return {
          Literal: node => {
            context.report({
              message: "I don't like literal!!!!!",
              node,
            });
          },
        };
      },
    },
    "check-unused-json-keys": {
      create: context => {
        const tsxFilePath = context.getFilename();
        console.log({ tsxFilePath });

        const jsonFilePath = path.resolve(__dirname, "src", "en.json");
        let jsonKeys = [];

        try {
          const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
          jsonKeys = Object.keys(jsonData);
        } catch (error) {
          console.error("Failed to read or parse en.json:", error);
        }

        const sourceCode = context.getSourceCode().getText();
        console.log({ sourceCode });

        const usedKeys = new Set();

        jsonKeys.forEach(key => {
          if (sourceCode.includes(`en['${key}']`) || sourceCode.includes(`en["${key}"]`)) {
            usedKeys.add(key);
          }
        });

        jsonKeys.forEach(key => {
          if (!usedKeys.has(key)) {
            context.report({
              message: `The key "${key}" defined in en.json is not used in the file.`,
              loc: { line: 1, column: 1 },
            });
          }
        });
        return {};
      },
    },
  },
};
