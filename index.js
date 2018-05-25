require('dotenv').config();
require('isomorphic-fetch');

const axios = require('axios');
const { toJson } = require('unsplash-js');

const {
  UNSPLASH_APP_BEARER_TOKEN,
} = process.env;

const instance = axios.create({
  baseURL: 'https://api.unsplash.com/',
  timeout: 1000,
  headers: { Authorization: `Client-ID ${UNSPLASH_APP_BEARER_TOKEN}` },
});

instance.get('photos/random')
  .then(toJson)
  .then(({ data }) => {
    console.log(data.urls.regular);
  }).catch(error => console.log(error));
