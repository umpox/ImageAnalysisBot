const axios = require('axios');
const oxford = require('project-oxford');
const { encode } = require('base64-arraybuffer');

const { unsplash, vision, twitter } = require('./apis');

let numberOfErrors = 0;

const getPhoto = async () => {
  const { data } = await unsplash.get('photos/random');
  return data.urls.regular;
};

const getCaption = async (img) => {
  const { data } = await vision.post(
    '/analyze?visualFeatures=categories,description,color',
    img,
  );
  return data.description.captions[0];
};

const getEncodedImage = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const base64 = encode(response.data);
  return oxford.makeBuffer(`data:image/jpeg;base64,${base64}`);
};

const tweetImageAndCaption = async (image, caption = {}) => {
  if (caption.confidence > 0.90) {
    // Lets get rid of the boring pictures :)
    throw new Error('Image too easy');
  }

  await twitter.post('media/upload', { media: image }, async (error, media) => {
    if (!error) {
      const status = {
        status: caption.text,
        media_ids: media.media_id_string,
      };

      await twitter.post('statuses/update', status);
    }
  });
};

const run = async () => {
  try {
    const url = await getPhoto();
    const imageData = await getEncodedImage(url);
    const caption = await getCaption(imageData);
    await tweetImageAndCaption(imageData, caption);
  } catch (error) {
    if (error.message === 'Image too easy' && numberOfErrors < 2) {
      numberOfErrors += 1;
      run();
    }
  }
};

run();
