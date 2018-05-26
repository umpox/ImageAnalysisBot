require('dotenv').config();
require('isomorphic-fetch');

const axios = require('axios');
const oxford = require('project-oxford');
const { encode } = require('base64-arraybuffer');
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

const tweetImageAndCaption = async (image, caption) => {
  await twitter.post('media/upload', { media: image }, async (error, media) => {
    if (!error) {
      const status = {
        status: caption,
        media_ids: media.media_id_string,
      };

      await twitter.post('statuses/update', status);
    }
  });
};

const run = async () => {
  const url = await getPhoto();
  const imageData = await getEncodedImage(url);
  const caption = await getCaption(imageData);
  await tweetImageAndCaption(imageData, caption);
};

run().catch(error => console.log(error));
