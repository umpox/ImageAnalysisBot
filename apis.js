require('dotenv').config();
require('isomorphic-fetch');

const axios = require('axios');
const Twitter = require('twitter');

const {
  UNSPLASH_APP_BEARER_TOKEN,
  VISION_SUBSCRIPTION_KEY,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
} = process.env;

const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com/',
  timeout: 1000,
  headers: { Authorization: `Client-ID ${UNSPLASH_APP_BEARER_TOKEN}` },
});

const vision = axios.create({
  baseURL: 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/',
  timeout: 10000,
  headers: {
    'Ocp-Apim-Subscription-Key': VISION_SUBSCRIPTION_KEY,
    'Content-Type': 'application/octet-stream',
  },
});

const twitter = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_SECRET,
});

module.exports = {
  unsplash,
  vision,
  twitter,
};
