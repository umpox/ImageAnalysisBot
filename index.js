const oxford = require('project-oxford');
const { encode } = require('base64-arraybuffer');

const { unsplash, vision, twitter } = require('./apis');

let numberOfErrors = 0;

const getCaption = async (img) => {
  const { data } = await vision.post(
    '/analyze?visualFeatures=categories,description,color',
    img,
  );
  return data.description.captions[0];
};

const getEncodedImage = async () => {
  const response = await unsplash.get('random', { responseType: 'arraybuffer' });
  const base64 = encode(response.data);
  return oxford.makeBuffer(`data:image/jpeg;base64,${base64}`);
};

const tweetImageAndCaption = async (image, caption = {}) => {
  if (caption.confidence > 0.85) {
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
    const imageData = await getEncodedImage();
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
