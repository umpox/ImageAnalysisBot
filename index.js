require('dotenv').config();
require('isomorphic-fetch');

const axios = require('axios');

const {
  UNSPLASH_APP_BEARER_TOKEN,
  VISION_SUBSCRIPTION_KEY,
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
    'Content-Type': 'application/json',
  },
});

const getPhoto = async () => {
  const { data } = await unsplash.get('photos/random');
  return data.urls.regular;
};

const getCaption = async (url) => {
  const { data } = await vision.post(
    '/analyze?visualFeatures=description',
    { url: 'https://images.pexels.com/photos/220762/pexels-photo-220762.jpeg' },
  );
  return data.description.captions[0].text;
};

const run = async () => {
  const url = await getPhoto();
  const caption = await getCaption(url);
  console.log(caption);
};

run();
