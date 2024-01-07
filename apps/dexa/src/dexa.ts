import type {
	Query,
	QueryGetFuzzyAbilityArgs,
	QueryGetFuzzyItemArgs,
	QueryGetFuzzyMoveArgs,
	QueryGetFuzzyPokemonArgs
} from '@favware/graphql-pokemon';
import { toTitleCase } from '@sapphire/utilities';
import { app as AlexaApp, request as Request, response as Response } from 'alexa-app';
import ApolloClient from 'apollo-boost';
import removeDiacritics from 'confusables';
import fetch from 'cross-fetch';
import * as c from './constants';

type GraphQLPokemonResponse<K extends keyof Omit<Query, '__typename'>> = Record<K, Omit<Query[K], '__typename'>>;

const enum SLOTS {
	POKEMON = 'POKEMON',
	ITEM = 'ITEM',
	ABILITY = 'ABILITY',
	MOVE = 'MOVE'
}

const enum INTENT_NAMES {
	DEX_INTENT = 'DexIntent',
	MOVE_INTENT = 'MoveIntent',
	ITEM_INTENT = 'ItemIntent',
	ABILITY_INTENT = 'AbilityIntent'
}

export default class extends AlexaApp {
	private apollo: ApolloClient<unknown>;
	private dFilter = this.removeNullAndUndefined.bind(this); // eslint-disable-line no-invalid-this
	private dElectricOrIce = /(electric|ice)/i;

	public constructor() {
		super('dexa');
		this.apollo = new ApolloClient({
			uri: 'https://graphqlpokemon.favware.tech/v8',
			fetchOptions: { headers: { 'User-Agent': 'Favware/Dexa <Alexa API service>' } },
			fetch
		});
		this.init();
	}

	public init() {
		this.launchIntent();
		this.stopIntent();
		this.cancelIntent();
		this.helpIntent();
		this.errorHandler();

		this.intent(
			INTENT_NAMES.DEX_INTENT,
			{
				slots: { [SLOTS.POKEMON]: SLOTS.POKEMON },
				utterances: [`data on {-|${SLOTS.POKEMON}}`, `pokemon data for {-|${SLOTS.POKEMON}}`, `pokemon data {-|${SLOTS.POKEMON}}`]
			},
			(req, res) => {
				const pokemon = removeDiacritics(req.slot(SLOTS.POKEMON));

				return this.DexIntent(res, req, pokemon);
			}
		);

		this.intent(
			INTENT_NAMES.MOVE_INTENT,
			{
				slots: { [SLOTS.MOVE]: SLOTS.MOVE },
				utterances: [`move data for {-|${SLOTS.MOVE}}`, `move data {-|${SLOTS.MOVE}}`]
			},
			(req, res) => {
				const move = removeDiacritics(req.slot(SLOTS.MOVE));

				return this.MoveIntent(res, req, move);
			}
		);

		this.intent(
			INTENT_NAMES.ITEM_INTENT,
			{
				slots: { [SLOTS.ITEM]: SLOTS.ITEM },
				utterances: [`item data {-|${SLOTS.ITEM}}`, `item data for {-|${SLOTS.ITEM}}`]
			},
			(req, res) => {
				const item = removeDiacritics(req.slot(SLOTS.ITEM));

				return this.ItemIntent(res, req, item);
			}
		);

		this.intent(
			INTENT_NAMES.ABILITY_INTENT,
			{
				slots: { [SLOTS.ABILITY]: SLOTS.ABILITY },
				utterances: [`ability data for {-|${SLOTS.ABILITY}}`, `ability data {-|${SLOTS.ABILITY}}`]
			},
			(req, res) => {
				const ability = removeDiacritics(req.slot(SLOTS.ABILITY));

				return this.AbilityIntent(res, req, ability);
			}
		);
	}

	public async DexIntent(res: Response, req: Request, pokemon: string) {
		try {
			const {
				data: { getFuzzyPokemon: result }
			} = await this.apollo.query<GraphQLPokemonResponse<'getFuzzyPokemon'>, QueryGetFuzzyPokemonArgs>({
				query: c.getFuzzyPokemon,
				variables: { pokemon }
			});
			const pokeData = result[0];
			const titleCaseName = toTitleCase(pokeData.species);

			const prevos = c.parsePrevos(pokeData);
			const evos = c.parseEvos(pokeData);

			const text = [
				`${titleCaseName}, number ${pokeData.num}, ${pokeData.flavorTexts[0].flavor}`,
				`It is ${pokeData.types.map((type) => type.name).join(' ')} type.`,
				prevos.length ? `Its pre-evolution${prevos.length >= 2 ? 's are' : ' is'} ${prevos.join(' and ')}.` : null,
				evos.length ? `It evolves into ${evos.join(' and ')}.` : null,
				`${titleCaseName} is typically ${pokeData.height} meters tall and weighs about ${pokeData.weight} kilograms.`,
				`${c.parseGenderRatio(pokeData.gender)}.`
			]
				.filter(this.dFilter)
				.join(' ');

			return res
				.say(text)
				.card({
					type: 'Simple',
					title: `Dex Pokémon Data for ${titleCaseName}`,
					content: text
				})
				.shouldEndSession(false);
		} catch (err) {
			return this.throwQueryErr(res, req, SLOTS.POKEMON);
		}
	}

	public async MoveIntent(res: Response, req: Request, move: string) {
		try {
			const {
				data: { getFuzzyMove: result }
			} = await this.apollo.query<GraphQLPokemonResponse<'getFuzzyMove'>, QueryGetFuzzyMoveArgs>({
				query: c.getFuzzyMove,
				variables: { move }
			});

			const moveData = result[0];
			const titleCaseName = toTitleCase(moveData.name);

			const text = [
				`${titleCaseName}, ${moveData.desc || moveData.shortDesc}`,
				`${titleCaseName} is a${this.dElectricOrIce.test(moveData.type) ? 'n' : ''} ${moveData.type} type move.`,
				`${titleCaseName} ${c.parseMoveBasePower(moveData.basePower, moveData.category)} and it has ${moveData.pp} pp.`,
				`Under normal conditions this move will have a priority of ${moveData.priority} and an accuracy of ${moveData.accuracy}%.`,
				`In battles with multiple Pokémon on each side it will have an effect on ${c.parseMoveTarget(moveData.target)}.`,
				moveData.isZ ? `This move is a Z Move and requires the Z-Crystal ${moveData.isZ}.` : null,
				moveData.isGMax ? `This move is a G MAX move and can only be used by G Max ${moveData.isGMax}.` : null,
				moveData.isNonstandard === 'Past' ? null : `${titleCaseName} is available in the generation 8 games.`
			]
				.filter(this.dFilter)
				.join(' ');

			return res
				.say(text)
				.card({
					type: 'Simple',
					title: `Dex Move Data for ${titleCaseName}`,
					content: text
				})
				.shouldEndSession(false);
		} catch {
			return this.throwQueryErr(res, req, SLOTS.MOVE);
		}
	}

	private async ItemIntent(res: Response, req: Request, item: string) {
		try {
			const {
				data: { getFuzzyItem: result }
			} = await this.apollo.query<GraphQLPokemonResponse<'getFuzzyItem'>, QueryGetFuzzyItemArgs>({
				query: c.getFuzzyItem,
				variables: { item }
			});
			const itemData = result[0];
			const titleCaseName = toTitleCase(itemData.name);

			const text = [
				`${titleCaseName}, ${itemData.desc}`,
				`It was introduced in generation ${itemData.generationIntroduced}.`,
				`${titleCaseName} is ${itemData.isNonstandard === 'Past' ? 'not ' : ''}available in Generation 8.`
			]
				.join(' ')
				.replace(/([0-9]{1}(\.[0-9]){0,1})x/gm, '$1 times');

			return res
				.say(text)
				.card({
					type: 'Simple',
					title: `Dex Item Data for ${titleCaseName}`,
					content: text
				})
				.shouldEndSession(false);
		} catch {
			return this.throwQueryErr(res, req, SLOTS.ITEM);
		}
	}

	private async AbilityIntent(res: Response, req: Request, ability: string) {
		try {
			const {
				data: { getFuzzyAbility: result }
			} = await this.apollo.query<GraphQLPokemonResponse<'getFuzzyAbility'>, QueryGetFuzzyAbilityArgs>({
				query: c.getFuzzyAbility,
				variables: { ability }
			});
			const abilityData = result[0];
			const titleCaseName = toTitleCase(abilityData.name);

			const text = `${titleCaseName}, ${abilityData.desc || abilityData.shortDesc}`;

			return res
				.say(text)
				.card({
					type: 'Simple',
					title: `Dex Ability Data for ${titleCaseName}`,
					content: text
				})
				.shouldEndSession(false);
		} catch {
			return this.throwQueryErr(res, req, SLOTS.ABILITY);
		}
	}

	private errorHandler() {
		this.error = (_exc: Error, req, res) => {
			try {
				switch (req.data.request.intent.name) {
					case INTENT_NAMES.DEX_INTENT:
						return res.say(`I couldn't find a Pokémon for ${req.slot(SLOTS.POKEMON)}. Are you sure you spelled that correctly?`);
					case INTENT_NAMES.ABILITY_INTENT:
						return res.say(`I couldn't find an Ability for ${req.slot(SLOTS.ABILITY)}. Are you sure you spelled that correctly?`);
					case INTENT_NAMES.MOVE_INTENT:
						return res.say(`I couldn't find an Move for ${req.slot(SLOTS.MOVE)}. I only support moves that have are used inside battles`);
					case INTENT_NAMES.ITEM_INTENT:
						return res.say(`I couldn't find an Item for ${req.slot(SLOTS.ITEM)}. Is that really an item that can be used in battle?`);
					default:
						return this.throwSystemErr(res);
				}
			} catch (err) {
				return this.throwSystemErr(res);
			}
		};
	}

	private helpIntent() {
		return this.intent(
			'AMAZON.HelpIntent',
			{
				slots: {},
				utterances: ['what are your commands', 'for help', 'help']
			},
			(_req, res) => {
				const helpOutput = [
					'Dexa provides many sources of information, Pokémon, Items, Abilities and Moves. Respectively these can be invoked with.',
					'1: Ask Dexa Browser pokémon data.',
					'2: Ask Dexa Browser item data.',
					'3: Ask Dexa Browser ability data.',
					'4: Ask Dexa Browser move data.',
					'',
					'You can always stop or cancel anything I am saying by saying "Alexa Stop" or "Alexa Cancel".',
					'If you want to start browsing you can request something now.'
				].join('\n');

				res.say(helpOutput).reprompt('I did not quite catch that, could you repeat it?').shouldEndSession(false);
			}
		);
	}

	private cancelIntent() {
		return this.intent(
			'AMAZON.CancelIntent',
			{
				slots: {},
				utterances: ['cancel', 'quit']
			},
			(_req, res) => {
				const cancelOutput = 'No problem. Request cancelled.';

				res.say(cancelOutput).shouldEndSession(true);
			}
		);
	}

	private stopIntent() {
		return this.intent(
			'AMAZON.StopIntent',
			{
				slots: {},
				utterances: ['stop', 'end']
			},
			(_req, res) => {
				const stopOutput = "Don't you worry, I'll be back";

				res.say(stopOutput).shouldEndSession(true);
			}
		);
	}

	private launchIntent() {
		return this.launch((_req, res) => {
			const prompt = [
				'Welcome to Dexa, your one stop place for PokéDex information.',
				'You can start browsing right away by giving me a command, or respond with "help" to learn all my commands.',
				'If you want to stop Dexa, then respond with "Alexa Stop".'
			].join(' ');

			const reprompt = 'I did not quite catch that, could you repeat it?';

			res.say(prompt).reprompt(reprompt).shouldEndSession(false);
		});
	}

	private removeNullAndUndefined<TValue>(value: TValue | null | undefined): value is TValue {
		return value !== null && value !== undefined;
	}

	private throwSystemErr(res: Response) {
		return res
			.say('Something went awfully wrong browsing my dataset. Please use "Alexa ask Dexa Browser for help" if you are unsure how to use Dexa')
			.shouldEndSession(false);
	}

	private throwQueryErr(res: Response, req: Request, slot: SLOTS) {
		const prompt = [
			'I am sorry but I could not resolve that query.',
			req.slot(slot) ? `I think you said ${removeDiacritics(req.slot(slot))}? ` : '',
			'Maybe try again, or respond with "Alexa Cancel" if you want to stop.'
		].join(' ');

		return res.say(prompt).reprompt(prompt).shouldEndSession(false);
	}
}
