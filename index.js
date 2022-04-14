const express = require("express");
const msal = require('@azure/msal-node');

const SERVER_PORT = process.env.PORT || 3000;

// Create Express App and Routes
const app = express();

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))

// Before running the sample, you will need to replace the values in the config,
// including the clientSecret
const config = {
    auth: {
        clientId: "3c7ac775-e5d7-4e16-a31c-2ee8abd5175a",
        authority: "https://login.microsoftonline.com/db992bae-4cb3-4086-8c91-55255b0c39fe",
        clientSecret: "Pp27Q~ThoO7ghHfO.cfhP4l4fNHy7-IMeRBad"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);

app.get('/', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "https://sybawebsite.azurewebsites.net:3000/redirect",
    };

    // get url to sign user in and consent to scopes needed for application
    cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "https://sybawebsite.azurewebsites.net:3000/redirect",
    };

    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});