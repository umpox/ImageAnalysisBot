require('dotenv').config();
require('isomorphic-fetch');

const axios = require('axios');
const oxford = require('project-oxford');
const { encode } = require('base64-arraybuffer');

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
    'Content-Type': 'application/octet-stream',
  },
});

const getPhoto = async () => {
  const { data } = await unsplash.get('photos/random');
  return data.urls.regular;
};

const getCaption = async (img) => {
  const { data } = await vision.post(
    '/analyze?visualFeatures=description',
    img,
  );
  return data.description.captions[0].text;
};

const getEncodedImage = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const base64 = encode(response.data);
  return oxford.makeBuffer(`data:image/jpeg;base64,${base64}`);
};

const run = async () => {
  const url = await getPhoto();
  const imageData = await getEncodedImage(url);
  const caption = await getCaption(imageData);
  console.log(caption);
};

run().catch(error => console.log(error));
