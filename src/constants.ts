import { Abilities, DexDetails, GenderEntry, Items, MoveEntry, Moves, Pokemon, Query } from '@favware/graphql-pokemon';

const AbilityFragment = `
fragment ability on AbilityEntry {
    desc
    shortDesc
    name
}`;

const DexDetailsFragment = `
fragment dexdetails on DexDetails {
  num
  species
  types
  evolutionLevel
  height
  weight
  sprite
  smogonTier
  flavorTexts { flavor }
  gender { male female }
  abilities { first second hidden special }
}`;

const EvolutionsFragment = `
${DexDetailsFragment}

fragment evolutions on DexDetails {
    evolutions {
        ...dexdetails
        evolutions {
          ...dexdetails
        }
      }
      preevolutions {
        ...dexdetails
        preevolutions {
          ...dexdetails
        }
      }
}`;

const ItemsFragment = `
fragment items on ItemEntry {
    desc
    name
    sprite
    isNonstandard
    generationIntroduced
}`;

const MoveFragment = `
fragment moves on MoveEntry {
    name
    shortDesc
    type
    basePower
    pp
    category
    accuracy
    priority
    target
    contestType
    isNonstandard
    isZ
    isGMax
    desc
}`;

export const getPokemonDetailsByFuzzy = (pokemon: string | Pokemon) => `
${EvolutionsFragment}

{
    getPokemonDetailsByFuzzy(pokemon: \"${pokemon}\" skip: 0 take: 1 reverse: true) {
        ...dexdetails
        ...evolutions
    }
}`;

export const getAbilityDetailsByFuzzy = (ability: string | Abilities) => `
${AbilityFragment}

{
    getAbilityDetailsByFuzzy(ability: \"${ability}\" skip: 0 take: 1) {
      ...ability
    }
}`;

export const getItemDetailsByFuzzy = (items: string | Items) => `
${ItemsFragment}

{
    getItemDetailsByFuzzy(item: \"${items}\" skip: 0 take: 1) {
        ...items
    }
}`;

export const getMoveDetailsByFuzzy = (move: string | Moves) => `
${MoveFragment}

{
    getMoveDetailsByFuzzy(move: \"${move}\" skip: 0 take: 1) {
        ...moves
    }
}`;

export const parsePrevos = (data: DexDetails) => {
  const prevos: string[] = [];
  const hasEvoByLevel = (evolutionMethod: string) => Number(evolutionMethod);

  data.preevolutions!.forEach(pr => {
    prevos.push(`${pr.species} ${hasEvoByLevel ? `(Level: ${data.evolutionLevel})` : `(Special Condition: ${data.evolutionLevel})`}`);

    if (pr.preevolutions) {
      pr.preevolutions.forEach(prr => {
        prevos.push(`${prr.species} ${hasEvoByLevel ? `(Level: ${pr.evolutionLevel})` : `(Special Condition: ${pr.evolutionLevel})`}`);
      });
    }
  });

  return prevos;
};

export const parseEvos = (data: DexDetails) => {
  const evos: string[] = [];
  const hasEvoByLevel = (evolutionMethod: string) => Number(evolutionMethod);

  data.evolutions!.forEach(evo => {
    evos.push(`${evo.species} ${hasEvoByLevel ? `(Level: ${evo.evolutionLevel})` : `(Special Condition: ${evo.evolutionLevel})`}`);

    if (evo.evolutions) {
      evo.evolutions.forEach(evvo => {
        evos.push(`${evvo.species} ${hasEvoByLevel ? `(Level: ${evvo.evolutionLevel})` : `(Special Condition: ${evvo.evolutionLevel})`}`);
      });
    }
  });

  return evos;
};

export const parseGenderRatio = (genderRatio: GenderEntry) => {
  if (genderRatio.male === '0%' && genderRatio.female === '0%') {
    return 'It is genderless';
  }

  return `It has a gender ratio of ${genderRatio.male} male and ${genderRatio.female} female`;
};

export const parseMoveBasePower = (basePower: MoveEntry['basePower'], category: MoveEntry['category']) => {
  if (category === 'Status') return 'is a status move';

  const basePowerNumber = Number(basePower);

  if (basePowerNumber === 0) return 'has a base power of 0';
  else if (basePowerNumber >= 1) return `has a base power of ${basePower}`;

  return `base power is calculated based on ${basePower}`;
};

export const parseMoveTarget = (target: MoveEntry['target']) => {
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

export type GraphQLPokemonResponse<K extends keyof Omit<Query, '__typename'>> = Record<K, Omit<Query[K], '__typename'>>;
export type GraphQLQueryReturnTypes = keyof Omit<Query, '__typename'>;
