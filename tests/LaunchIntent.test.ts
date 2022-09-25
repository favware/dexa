import fetch from 'supertest';
import { oneLine, SERVER } from './utils';

describe('LaunchIntent', () => {
  test('GIVEN Request to Launch THEN returns launch blurb', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'LaunchRequest'
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Welcome to Dexa, your one stop place for PokéDex information.
      You can start browsing right away by giving me a command, or respond with \"help\" to learn all my commands.
      If you want to stop Dexa, then respond with \"Alexa Stop\".</speak>
  `)
    );
  });
});
