require('dotenv').config();
require('isomorphic-fetch');

const axios = require('axios');
const Twitter = require('twitter');

const {
  VISION_SUBSCRIPTION_KEY,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
} = process.env;

const unsplash = axios.create({
  baseURL: 'https://source.unsplash.com/',
  timeout: 10000,
});

const vision = axios.create({
  baseURL: 'https://westeurope.api.cognitive.microsoft.com/vision/v2.0/',
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
