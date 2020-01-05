import { oneLine } from 'common-tags';
import fetch from 'supertest';
import { SERVER, setup, teardown } from './utils';

describe('AbilityIntent', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    teardown();
  });

  test('GIVEN Ability THEN returns data', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'AbilityIntent',
            slots: {
              ABILITY: {
                name: 'ABILITY',
                value: 'multiscale'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(oneLine`
    <speak>Multiscale, If this Pokemon is at full HP, damage taken from attacks is halved.</speak>
  `);
  });
});
