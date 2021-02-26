// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'o5j4wm7gxl'
const apiRegion = 'us-east-2'
export const apiEndpoint = `https://${apiId}.execute-api.${apiRegion}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-x4xgby3m.us.auth0.com',            // Auth0 domain
  clientId: '3jbZCNypbMI2vrwT2c0Iaut6d5W2P5A5',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
