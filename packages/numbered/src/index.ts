import { objectKeys } from '@sapphire/utilities/objectKeys';

const NUMBER_MAP: NumberMap = {
	'.': 'point',
	'-': 'negative',
	0: 'zero',
	1: 'one',
	2: 'two',
	3: 'three',
	4: 'four',
	5: 'five',
	6: 'six',
	7: 'seven',
	8: 'eight',
	9: 'nine',
	10: 'ten',
	11: 'eleven',
	12: 'twelve',
	13: 'thirteen',
	14: 'fourteen',
	15: 'fifteen',
	16: 'sixteen',
	17: 'seventeen',
	18: 'eighteen',
	19: 'nineteen',
	20: 'twenty',
	30: 'thirty',
	40: 'forty',
	50: 'fifty',
	60: 'sixty',
	70: 'seventy',
	80: 'eighty',
	90: 'ninety'
};

/**
 * @see http://en.wikipedia.org/wiki/English_numerals#Cardinal_numbers
 */
const CARDINAL_MAP: CardinalMap = {
	2: 'hundred',
	3: 'thousand',
	6: 'million',
	9: 'billion',
	12: 'trillion',
	15: 'quadrillion',
	18: 'quintillion',
	21: 'sextillion',
	24: 'septillion',
	27: 'octillion',
	30: 'nonillion',
	33: 'decillion',
	36: 'undecillion',
	39: 'duodecillion',
	42: 'tredecillion',
	45: 'quattuordecillion',
	48: 'quindecillion',
	51: 'sexdecillion',
	54: 'septendecillion',
	57: 'octodecillion',
	60: 'novemdecillion',
	63: 'vigintillion',
	100: 'googol',
	303: 'centillion'
};

// Make a hash of words back to their numeric value.
const WORD_MAP: WordMap = {
	nil: 0,
	naught: 0,
	period: '.',
	decimal: '.'
};

for (const num of objectKeys(NUMBER_MAP)) {
	WORD_MAP[NUMBER_MAP[num]] = isNaN(Number(num)) ? num : Number(num);
}

for (const num of objectKeys(CARDINAL_MAP)) {
	WORD_MAP[CARDINAL_MAP[num]] = isNaN(Number(num)) ? num : Math.pow(10, Number(num));
}

/**
 * Returns the number of significant figures for the number.
 */
function intervals(num: string | number): number {
	const match = String(num).match(/e\+(\d+)/);

	if (match) {
		return Number(match[1]);
	}

	return String(num).length - 1;
}

/**
 * Turn a number into a string representation.
 */
export function stringify(value: number): string {
	const num = Number(value);
	const floor = Math.floor(num);

	// If the number is in the numbers object, we quickly return.
	if (NUMBER_MAP[num]) return NUMBER_MAP[num];

	// If the number is a negative value.
	if (num < 0) return `${NUMBER_MAP['-']} ${stringify(-num)}`;

	// Check if we have decimals.
	if (floor !== num) {
		const words = [stringify(floor), NUMBER_MAP['.']];
		const chars = String(num).split('.').pop();

		for (const char of chars ?? '') {
			words.push(stringify(Number(char)));
		}

		return words.join(' ');
	}

	let interval = intervals(num);

	// It's below one hundred, but greater than nine.
	if (interval === 1) {
		return `${NUMBER_MAP[Math.floor(num / 10) * 10]}-${stringify(Math.floor(num % 10))}`;
	}

	const sentence = [];

	// Simple check to find the closest full number helper.
	while (!CARDINAL_MAP[interval]) interval -= 1;

	if (CARDINAL_MAP[interval]) {
		const remaining = Math.floor(num % Math.pow(10, interval));

		sentence.push(stringify(Math.floor(num / Math.pow(10, interval))));
		sentence.push(CARDINAL_MAP[interval] + (remaining > 99 ? ',' : ''));

		if (remaining) {
			if (remaining < 100) sentence.push('and');

			sentence.push(stringify(remaining));
		}
	}

	return sentence.join(' ');
}

interface NumberMap {
	[k: string]: string;
}

interface CardinalMap {
	[k: number]: string;
}

interface WordMap {
	[k: string]: string | number;
}
