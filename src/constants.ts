import type { Gender, Move, Pokemon } from '@favware/graphql-pokemon';
import { toTitleCase } from '@sapphire/utilities';
import gql from 'graphql-tag';

export const getFuzzyPokemon = gql`
  fragment evolutionsData on Pokemon {
    species
    evolutionLevel
  }

  fragment dexdetails on Pokemon {
    num
    species
    types {
      name
    }
    evolutionLevel
    height
    weight
    flavorTexts {
      flavor
    }
    gender {
      male
      female
    }
  }

  fragment evolutions on Pokemon {
    evolutions {
      ...evolutionsData
      evolutions {
        ...evolutionsData
      }
    }
    preevolutions {
      ...evolutionsData
      preevolutions {
        ...evolutionsData
      }
    }
  }

  query getFuzzyPokemon($pokemon: String!) {
    getFuzzyPokemon(pokemon: $pokemon) {
      ...dexdetails
      ...evolutions
    }
  }
`;

export const getFuzzyAbility = gql`
  query getFuzzyAbility($ability: String!) {
    getFuzzyAbility(ability: $ability) {
      desc
      shortDesc
      name
    }
  }
`;

export const getFuzzyItem = gql`
  query getFuzzyItem($item: String!) {
    getFuzzyItem(item: $item) {
      desc
      name
      isNonstandard
      generationIntroduced
    }
  }
`;

export const getFuzzyMove = gql`
  query getFuzzyMove($move: String!) {
    getFuzzyMove(move: $move) {
      name
      shortDesc
      type
      basePower
      pp
      category
      accuracy
      priority
      target
      isNonstandard
      isZ
      isGMax
      desc
    }
  }
`;

export const parsePrevos = (data: Pokemon) => {
  const prevos: string[] = [];
  const hasEvoByLevel = (evolutionMethod: string | null | undefined) => Number(evolutionMethod);

  if (!data.preevolutions) return prevos;

  data.preevolutions.forEach((pr) => {
    prevos.push(
      [
        `${toTitleCase(pr.species)}`,
        `${hasEvoByLevel(data.evolutionLevel) ? `(Level: ${data.evolutionLevel})` : `(Special Condition: ${data.evolutionLevel})`}`
      ].join(' ')
    );

    if (pr.preevolutions) {
      pr.preevolutions.forEach((prr) => {
        prevos.push(
          [
            `${toTitleCase(prr.species)}`,
            `${hasEvoByLevel(pr.evolutionLevel) ? `(Level: ${pr.evolutionLevel})` : `(Special Condition: ${pr.evolutionLevel})`}`
          ].join(' ')
        );
      });
    }
  });

  return prevos;
};

export const parseEvos = (data: Pokemon) => {
  const evos: string[] = [];
  const hasEvoByLevel = (evolutionMethod: string | null | undefined) => Number(evolutionMethod);

  if (!data.evolutions) return evos;

  data.evolutions.forEach((evo) => {
    evos.push(
      [
        `${toTitleCase(evo.species)}`,
        `${hasEvoByLevel(evo.evolutionLevel) ? `(Level: ${evo.evolutionLevel})` : `(Special Condition: ${evo.evolutionLevel})`}`
      ].join(' ')
    );

    if (evo.evolutions) {
      evo.evolutions.forEach((evvo) => {
        evos.push(
          [
            `${toTitleCase(evvo.species)}`,
            `${hasEvoByLevel(evvo.evolutionLevel) ? `(Level: ${evvo.evolutionLevel})` : `(Special Condition: ${evvo.evolutionLevel})`}`
          ].join(' ')
        );
      });
    }
  });

  return evos;
};

export const parseGenderRatio = (genderRatio: Gender) => {
  if (genderRatio.male === '0%' && genderRatio.female === '0%') {
    return 'It is genderless';
  }

  return `It has a gender ratio of ${genderRatio.male} male and ${genderRatio.female} female`;
};

export const parseMoveBasePower = (basePower: Move['basePower'], category: Move['category']) => {
  if (category === 'Status') return 'is a status move';

  const basePowerNumber = Number(basePower);

  if (basePowerNumber === 0) return 'has a base power of 0';
  else if (basePowerNumber >= 1) return `has a base power of ${basePower}`;

  return `base power is calculated based on ${basePower}`;
};

export const parseMoveTarget = (target: Move['target']) => {
  switch (target) {
    case 'Adjacent Ally':
      return 'the directly adjacent ally';
    case 'Adjacent Ally or Self':
      return 'the directly adjacent ally or the user';
    case 'Adjacent Foes':
      return 'all adjacent foes';
    case 'All':
      return 'all Pokémon';
    case 'All Adjacent':
      return 'all adjacent Pokémon';
    case "Ally's Side":
      return "the ally's side";
    case 'Any':
      return 'any Pokémon';
    case 'Foe that last hit user':
      return 'the foe that last hit the user';
    case "Foe's Side":
      return 'the entire side of the foe';
    case 'Normal':
      return 'regular targets';
    case 'Random':
      return 'a random target';
    case 'Self':
      return 'the user';
    default:
      return 'any Pokémon';
  }
};
