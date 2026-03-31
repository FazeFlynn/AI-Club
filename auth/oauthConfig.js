// OAuth Configuration
// Get these from your OAuth provider dashboards

const OAUTH_CONFIG = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_HERE',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        scopes: 'openid email profile'
    },
    microsoft: {
        clientId: process.env.MICROSOFT_CLIENT_ID || 'YOUR_MICROSOFT_CLIENT_ID_HERE',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'YOUR_MICROSOFT_CLIENT_SECRET_HERE',
        tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        scopes: 'openid profile email'
    }
};

module.exports = { OAUTH_CONFIG };
