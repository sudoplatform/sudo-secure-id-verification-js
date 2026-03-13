const {
    defineConfig,
} = require("@eslint/config-helpers");

const globals = require("globals");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const _import = require("eslint-plugin-import");
const prettier = require("eslint-plugin-prettier");

const {
    fixupPluginRules,
} = require("@eslint/compat");

const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    js.configs.recommended,
    {
        files: ["**/*.js"],

        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {},

            globals: {
                ...globals.node,
            },
        },
    }, {
        files: ["src/**/*.ts", "!src/**/*.spec.ts"],
        ignores: ["**/*.spec.ts"],

        plugins: {
            "@typescript-eslint": typescriptEslint,
            import: fixupPluginRules(_import),
            prettier,
        },

        languageOptions: {
            parser: tsParser,

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        extends: compat.extends(
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
            "prettier",
        ),

        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/no-inferrable-types": "off",

            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
            }],

            "@typescript-eslint/explicit-function-return-type": ["error", {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
            }],
        },
    }, {
        files: ["**/*.d.ts"],

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    }, {
        files: ["**/*.spec.ts", "test/**/*.ts"],
        ignores: ["test/setup.ts"],

        plugins: {
            "@typescript-eslint": typescriptEslint,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            parser: tsParser,

            parserOptions: {
                project: "./tsconfig.test.json",
            },
        },

        extends: compat.extends(
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
            "prettier",
        ),

        rules: {
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    }, {
        files: ["test/setup.ts"],

        plugins: {
            "@typescript-eslint": typescriptEslint,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            parser: tsParser,

            parserOptions: {
                project: "./tsconfig.test.json",
            },
        },

        extends: compat.extends(
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
            "prettier",
        ),

        rules: {
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-require-imports": "off",
        },
    }, {
        ignores: ["**/node_modules", "**/lib", "**/document", "**/gen", "**/graphql"],
    }]);
