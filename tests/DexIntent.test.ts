import fetch from 'supertest';
import { oneLine, SERVER } from './utils';

describe('DexIntent', () => {
  test('GIVEN Pokémon with evolutions THEN returns data with prevos', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'dragonite'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
        <speak>Dragonite, number 149, It can fly in spite of its big and bulky physique. It circles the globe in just 16 hours.
        It is Dragon Flying type.
        Its pre-evolutions are Dragonair (Level: 55) and Dratini (Level: 30).
        Dragonite is typically 2.2 meters tall and weighs about 210 kilograms.
        It has a gender ratio of 50% male and 50% female.</speak>
    `)
    );
  });

  test('GIVEN Pokémon with complicated evolutions THEN returns data with varying evos', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'eevee'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);

    expect(ssml).toBe(
      oneLine(`
          <speak>Eevee, number 133, Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.
          It is Normal type.
          It evolves into
          Vaporeon (Special Condition: use Water Stone) and
          Jolteon (Special Condition: use Thunder Stone) and
          Flareon (Special Condition: use Fire Stone) and
          Espeon (Special Condition: Level up during Daytime with happiness of at least 220) and
          Umbreon (Special Condition: Level up during Nighttime with happiness of at least 220) and
          Leafeon (Special Condition: use Leaf Stone) and
          Glaceon (Special Condition: use Ice Stone) and
          Sylveon (Special Condition: Level up while having high Affection and knowing a Fairy type move).
          Eevee is typically 0.3 meters tall and weighs about 6.5 kilograms.
          It has a gender ratio of 87.5% male and 12.5% female.</speak>
    `)
    );
  });

  test('GIVEN Pokémon with pre-evolution and evolution THEN returns data with prevo and evo', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'dragonair'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
        <speak>Dragonair, number 148, It is called the divine Pokémon. When its entire body brightens slightly, the weather changes.
        It is Dragon type.
        Its pre-evolution is Dratini (Level: 30).
        It evolves into Dragonite (Level: 55).
        Dragonair is typically 4 meters tall and weighs about 16.5 kilograms.
        It has a gender ratio of 50% male and 50% female.</speak>
    `)
    );
  });

  test('GIVEN Pokémon with two evolution THEN returns data with evos', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'dratini'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
        <speak>Dratini, number 147, It is born large to start with. It repeatedly sheds its skin as it steadily grows longer.
          It is Dragon type.
          It evolves into Dragonair (Level: 30) and Dragonite (Level: 55).
          Dratini is typically 1.8 meters tall and weighs about 3.3 kilograms.
          It has a gender ratio of 50% male and 50% female.</speak>
    `)
    );
  });

  test('GIVEN Pokémon with no evolutions or pre-evolutions THEN returns data of just Pokémon', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'smeargle'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
      <speak>Smeargle, number 235, The color of the mysterious fluid secreted from the tip of the tail is predetermined for each Smeargle.
      It is Normal type.
      Smeargle is typically 1.2 meters tall and weighs about 58 kilograms.
      It has a gender ratio of 50% male and 50% female.</speak>
    `)
    );
  });

  test('GIVEN Pokémon with no genders THEN returns data of with genderless', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'metagross'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);

    expect(ssml).toBe(
      oneLine(`
      <speak>Metagross, number 376, It firmly pins its prey using its four claws and large body.
      Then Metagross uses the mouth on its stomach to chew its prey to bits.
      It is Steel Psychic type.
      Its pre-evolutions are Metang (Level: 45) and Beldum (Level: 20).
      Metagross is typically 1.6 meters tall and weighs about 550 kilograms.
      It is genderless.</speak>
    `)
    );
  });

  test('GIVEN a gmax Pokemon THEN returns gmax information', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'gigantamax charizard'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Charizard-gmax, number 6, The flame inside its body burns hotter than 3,600 degrees Fahrenheit.
      When Charizard roars, that temperature climbs even higher.
      It is Fire Flying type.
      Charizard-gmax is typically 28 meters tall and weighs about 100.5 kilograms.
      It has a gender ratio of 87.5% male and 12.5% female.</speak>
  `)
    );
  });

  test('GIVEN a mega Pokemon THEN returns mega information', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'mega metagross'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Metagross-mega, number 376, When it knows it can't win,
      it digs the claws on its legs into its opponent and starts the countdown to a big explosion.
      It is Steel Psychic type.
      Metagross-mega is typically 2.5 meters tall and weighs about 942.9 kilograms.
      It is genderless.</speak>
  `)
    );
  });

  test('GIVEN an alolan forme Pokemon THEN returns alolan information', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'alolan sandshrew'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Sandshrew-alola, number 27, It lives in snowy mountains on southern islands.
      When a blizzard rolls in, this Pokémon hunkers down in the snow to avoid getting blown away.
      It is Ice Steel type.
      It evolves into Sandslash-alola (Special Condition: use Icestone).
      Sandshrew-alola is typically 0.7 meters tall and weighs about 40 kilograms.
      It has a gender ratio of 50% male and 50% female.</speak>
  `)
    );
  });

  test('GIVEN a galarian forme Pokemon THEN returns galarian information', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'galarian ponyta'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Ponyta-galar, number 77, This Pokémon will look into your eyes and read the contents of your heart.
      If it finds evil there, it promptly hides away.
      It is Psychic type. It evolves into Rapidash-galar (Level: 40).
      Ponyta-galar is typically 0.8 meters tall and weighs about 24 kilograms.
      It has a gender ratio of 50% male and 50% female.</speak>
  `)
    );
  });

  test('GIVEN an alolan forme evolution Pokemon THEN returns mixed information', async () => {
    expect.assertions(2);

    const res = await fetch(SERVER)
      .post('/dexa')
      .send({
        request: {
          type: 'IntentRequest',
          intent: {
            name: 'DexIntent',
            slots: {
              POKEMON: {
                name: 'POKEMON',
                value: 'alolan raichu'
              }
            }
          }
        }
      });

    const { ssml } = res.body.response.outputSpeech;

    expect(res.status).toBe(200);
    expect(ssml).toBe(
      oneLine(`
    <speak>Raichu-alola, number 26, This Pokémon rides on its tail while it uses its psychic powers to levitate.
    It attacks with star-shaped thunderbolts.
    It is Electric Psychic type.
    Its pre-evolutions are Pikachu (Special Condition: use Thunder Stone) and Pichu (Special Condition: Level up with happiness of at least 220).
    Raichu-alola is typically 0.7 meters tall and weighs about 21 kilograms.
    It has a gender ratio of 50% male and 50% female.</speak>
  `)
    );
  });
});
