"use strict";
const oxford = require('project-oxford');
const { encode } = require('base64-arraybuffer');
const { IgApiClient } = require('instagram-private-api')

const { unsplash, vision, twitter } = require('./apis');

let numberOfErrors = 0;

const getCaption = async (img) => {
  const { data } = await vision.post(
    '/analyze?visualFeatures=description',
    img,
  );
  const caption = data.description.captions[0];

  if (caption.confidence > 0.85) {
    // Lets get rid of the boring pictures :)
    throw new Error('Image too easy');
  }

  if (!caption.text) {
    throw new Error('No caption');
  }

  // TOTALLYNOTROBOTS
  return caption.text.toUpperCase();
};

const getEncodedImage = async () => {
  const response = await unsplash.get('random/800x600', { responseType: 'arraybuffer' });
  const base64 = encode(response.data);
  return oxford.makeBuffer(`data:image/jpeg;base64,${base64}`);
};

const twitterPost = async (image, caption) => {
  return twitter.post('media/upload', { media: image }, async (error, media) => {
    if (!error) {
      const status = {
        status: caption,
        media_ids: media.media_id_string,
      };

      await twitter.post('statuses/update', status);
    }
  });
}

const instagramPost = async (image, caption) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  return ig.publish.photo({
    file: image,
    caption: caption,
  });
}

const run = async () => {
  try {
    const imageData = await getEncodedImage();
    const caption = await getCaption(imageData);
    await twitterPost(imageData, caption);
    await instagramPost(imageData, caption);
  } catch (error) {
    if (error.message === 'Image too easy' && numberOfErrors < 9) {
      numberOfErrors += 1;
      run();
    }
  }
};

run();
