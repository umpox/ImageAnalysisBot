require('dotenv').config();
require('isomorphic-fetch');

const axios = require('axios');
const { toJson } = require('unsplash-js');

const {
  UNSPLASH_APP_BEARER_TOKEN,
  VISION_SUBSCRIPTION_KEY
} = process.env;

const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com/',
  timeout: 1000,
  headers: { Authorization: `Client-ID ${UNSPLASH_APP_BEARER_TOKEN}` },
});

const vision = axios.create({
  baseURL: 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/',
  timeout: 1000,
  headers: {
    'Ocp-Apim-Subscription-Key': VISION_SUBSCRIPTION_KEY,
  },
});

unsplash.get('photos/random')
  .then(toJson)
  .then(({ data }) => {
    console.log(data.urls.regular);
  }).catch(error => console.log(error));
