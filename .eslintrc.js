module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
        "react-native/react-native": true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-native/all",
        "plugin:prettier/recommended",
        "@react-native-community",
        "prettier",
        "eslint-config-prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: [
        "react",
        "react-native",
        "@typescript-eslint",
        "prettier",
        "jest",
    ],
    rules: {
        "prettier/prettier": "error",
        "no-unused-vars": "warn",
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": ["warn"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            rules: {
                "@typescript-eslint/no-unused-vars": ["warn"],
                "react-native/no-color-literals": "off",
            },
        },
    ],
};
