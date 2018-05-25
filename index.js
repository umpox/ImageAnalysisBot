require('dotenv').config();
require('isomorphic-fetch');

const Unsplash = require('unsplash-js').default;
const { toJson } = require('unsplash-js');

const {
  UNSPLASH_APP_ID,
  UNSPLASH_APP_SECRET,
  UNSPLASH_APP_CALLBACK,
} = process.env;

const unsplash = new Unsplash({
  applicationId: UNSPLASH_APP_ID,
  secret: UNSPLASH_APP_SECRET,
  callbackUrl: UNSPLASH_APP_CALLBACK,
});

unsplash.photos.getRandomPhoto()
  .then(toJson)
  .then(json => console.log(json));
