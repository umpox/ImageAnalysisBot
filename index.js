require('dotenv').config();
const Unsplash = require('unsplash-js').default;

const { 
    UNSPLASH_APP_ID,
    UNSPLASH_APP_SECRET,
    UNSPLASH_APP_CALLBACK 
} = process.env;

const unsplash = new Unsplash({
  applicationId: UNSPLASH_APP_ID,
  secret: UNSPLASH_APP_SECRET,
  callbackUrl: UNSPLASH_APP_CALLBACK
});