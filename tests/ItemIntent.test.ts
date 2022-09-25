import fetch from 'supertest';
import { oneLine, SERVER } from './utils';

describe('ItemIntent', () => {
  test('GIVEN Item in Generation 8 THEN returns data', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'ItemIntent',
            slots: {
              ITEM: {
                name: 'ITEM',
                value: 'Life Orb'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Life Orb, Holder's attacks do 1.3 times damage, and it loses 1/10 its max HP after the attack.
      It was introduced in generation 4.
      Life Orb is available in Generation 8.</speak>
  `)
    );
  });

  test('GIVEN Item not in Generation 8 THEN returns data', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'ItemIntent',
            slots: {
              ITEM: {
                name: 'ITEM',
                value: 'pikashuniumz'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Pikashunium Z, If held by cap Pikachu with Thunderbolt, it can use 10,000,000 Volt Thunderbolt.
      It was introduced in generation 7.
      Pikashunium Z is not available in Generation 8.</speak>
  `)
    );
  });
});
