import fetch from 'supertest';
import { oneLine, SERVER } from './utils';

describe('AbilityIntent', () => {
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
    expect(ssml).toBe(oneLine('<speak>Multiscale, If this Pokémon is at full HP, damage taken from attacks is halved.</speak>'));
  });
});
