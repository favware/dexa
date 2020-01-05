import { oneLine } from 'common-tags';
import fetch from 'supertest';
import { SERVER, setup, teardown } from './utils';

describe('MoveIntent', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    teardown();
  });

  test('GIVEN Normal move THEN returns regular data', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'MoveIntent',
            slots: {
              MOVE: {
                name: 'MOVE',
                value: 'dragon claw'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(oneLine`
      <speak>Dragon Claw, No additional effect.
        Dragon Claw is a Dragon type move.
        Dragon Claw has a base power of 80 and it has 15 pp.
        Under normal conditions this move will have a priority of 0 and an accuracy of 100%.
        In battles with multiple Pokémon on each side it will have an effect on regular targets.
        Dragon Claw is available in the Generaton 8 games.</speak>
  `);
  });

  test('GIVEN Status move THEN returns move without base power', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'MoveIntent',
            slots: {
              MOVE: {
                name: 'MOVE',
                value: 'dragondance'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(oneLine`
    <speak>Dragon Dance, Raises the user's Attack and Speed by 1 stage.
      Dragon Dance is a Dragon type move.
      Dragon Dance is a status move and it has 20 pp.
      Under normal conditions this move will have a priority of 0 and an accuracy of 100%.
      In battles with multiple Pokémon on each side it will have an effect on the user.
      Dragon Dance is available in the Generaton 8 games.</speak>
  `);
  });

  test('GIVEN special base power move THEN returns special calculated basepower', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'MoveIntent',
            slots: {
              MOVE: {
                name: 'MOVE',
                value: 'pikapapow'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(oneLine`
    <speak>Pika Papow, Max happiness: 102 power.
      Can\'t miss. Pika Papow is an Electric type move.
      Pika Papow base power is calculated based on (happiness * 10) / 25 and it has 20 pp.
      Under normal conditions this move will have a priority of 0 and an accuracy of 100%.
      In battles with multiple Pokémon on each side it will have an effect on regular targets.
      Pika Papow is available in the Generaton 8 games.</speak>
  `);
  });

  test('GIVEN move with base power 0 THEN returns has 0 base power', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'MoveIntent',
            slots: {
              MOVE: {
                name: 'MOVE',
                value: 'return'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(oneLine`
    <speak>Return, Max 102 power at maximum Happiness.
      Return is a Normal type move.
      Return has a base power of 0 and it has 20 pp.
      Under normal conditions this move will have a priority of 0 and an accuracy of 100%.
      In battles with multiple Pokémon on each side it will have an effect on regular targets.</speak>
  `);
  });

  test('GIVEN Z-Move THEN returns Z-Crystal', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'MoveIntent',
            slots: {
              MOVE: {
                name: 'MOVE',
                value: 'catastropika'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(oneLine`
    <speak>Catastropika, No additional effect.
      Catastropika is an Electric type move.
      Catastropika has a base power of 210 and it has 1 pp.
      Under normal conditions this move will have a priority of 0 and an accuracy of 100%.
      In battles with multiple Pokémon on each side it will have an effect on regular targets.
      This move is a Z Move and requires the Z-Crystal Pikanium Z.</speak>
  `);
  });

  test('GIVEN GMAX-Move THEN returns Pokémon that can use this move', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'MoveIntent',
            slots: {
              MOVE: {
                name: 'MOVE',
                value: 'gmaxvoltcrash'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(oneLine`
    <speak>G-max Volt Crash, Paralyzes foe(s).
      BP scales with base move.
      G-max Volt Crash is an Electric type move.
      G-max Volt Crash has a base power of 10 and it has 10 pp.
      Under normal conditions this move will have a priority of 0 and an accuracy of 100%.
      In battles with multiple Pokémon on each side it will have an effect on all adjacent foes.
      This move is a G MAX move and can only be used by G Max Pikachu.
      G-max Volt Crash is available in the Generaton 8 games.</speak>
  `);
  });
});
