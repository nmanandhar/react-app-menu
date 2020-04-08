/**
 * Configuration to tell mocha to transpile files using babel
 */

const register = require('@babel/register').default;

register(
    {
        extensions: ['.ts', '.js', '.tsx'],
        presets:[
            "react-app"
        ]
    },
);
