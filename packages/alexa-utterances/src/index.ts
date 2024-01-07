import { stringify } from '@favware/numbered';
import { objectEntries } from '@sapphire/utilities/objectEntries';

function subCartesian<T1, T2>(a: T1[], b: T2[]) {
	return ([] as (T1 | T2)[][]).concat(...a.map((d) => b.map((e) => ([] as (T1 | T2)[]).concat(d, e))));
}

function cartesian<T1, T2, T3>(a: T1[], b?: T2[] | undefined, ...c: T3[]): any {
	return b ? cartesian(subCartesian(a, b), c) : a;
}

/**
 * Util functions for generating schema and utterances
 *
 * Convert a number range like 5-10 into an array of english words
 *
 * @param start - The starting number of the range.
 * @param end - The ending number of the range.
 * @param by - The increment value for each step in the range.
 * @returns An array of string representations of the expanded number range.
 */
function expandNumberRange(start: number, end: number, by: number) {
	by = by || 1; // incrementing by 0 is a bad idea
	const converted = [];

	for (let i = start; i <= end; i += by) {
		converted.push(stringify(i).replace(/-/g, ' '));
	}

	return converted;
}

/**
 * Determine if a curly brace expression is a Slot name literal
 * Returns true if expression is of the form {-|Name}, false otherwise
 * @param braceExpression
 * @returns
 */
function isSlotLiteral(braceExpression: string) {
	return braceExpression.startsWith('{-|');
}

/**
 * Recognize shortcuts in utterance definitions and swap them out with the actual values
 */
function expandShortcuts(str: string, dictionary: Record<PropertyKey, string[]>) {
	// If the string is found in the dictionary, just provide the matching values
	if (typeof dictionary == 'object' && typeof dictionary[str] != 'undefined') {
		return dictionary[str];
	}

	// Numbered ranges, ex: 5-100 by 5
	const match = str.match(/(\d+)\s*-\s*(\d+)(\s+by\s+(\d+))?/);
	if (match) {
		return expandNumberRange(Number(match[1]), Number(match[2]), Number(match[4]));
	}

	return [str];
}

const slotIndexes: number[] = [];

function expandSlotValues(variations: string[][][], slotSampleValues: string[][]): string[][][] {
	for (const [slot, sampleValues] of objectEntries(slotSampleValues)) {
		let idx = -1;
		if (typeof slotIndexes[slot] !== 'undefined') {
			idx = slotIndexes[slot];
		}

		const newVariations = [];

		if (variations.length < sampleValues.length) {
			const mod = variations.length;
			let xtraidx = 0;
			while (variations.length < sampleValues.length) {
				variations.push(variations[xtraidx]);
				xtraidx = (xtraidx + 1) % mod;
			}
		}

		for (const [j, variation] of variations.entries()) {
			const newVariation = [];
			for (let [k, value] of variation.entries()) {
				if (value === `slot-${slot}`) {
					idx = (idx + 1) % sampleValues.length;
					slotIndexes[slot] = idx;

					value = sampleValues[idx];
				}

				newVariation.push(value);
			}
			newVariations.push(newVariation);
		}

		variations = newVariations;
	}

	return variations;
}

// Generate a list of utterances from a template
export function generateUtterances(
	str: string,
	slots: Record<PropertyKey, string> | null,
	dictionary: Record<PropertyKey, string[]>,
	exhaustiveUtterances = true
) {
	const placeholders: string[][] = [];
	let utterances: string[] = [];
	const slotmap: Record<string, number> = {};
	const slotValues: string[][] = [];

	// First extract sample placeholders values from the string
	str = str.replace(/\{([^\}]+)\}/g, (match, p1: string) => {
		if (isSlotLiteral(match)) {
			return match;
		}

		const expandedValues: string[] = [];
		let slot;
		const values = p1.split('|');
		// If the last of the values is a SLOT name, we need to keep the name in the utterances
		if (values && values.length && values.length > 1 && slots && typeof slots[values[values.length - 1]] != 'undefined') {
			slot = values.pop();
		}

		for (const val of values) {
			expandedValues.push(...expandShortcuts(val, dictionary));
		}

		if (slot) {
			slotmap[slot] = placeholders.length;
		}

		// if we're dealing with minimal utterances, we will delay the expansion of the
		// values for the slots; all the non-slot expansions need to be fully expanded
		// in the cartesian product
		if (!exhaustiveUtterances && slot) {
			placeholders.push([`slot-${slot}`]);
			// @ts-expect-error get the index of a string in a string array is valid
			slotValues[slot] = expandedValues;
		} else {
			placeholders.push(expandedValues);
		}

		return `{${slot || placeholders.length - 1}}`;
	});

	// Generate all possible combinations using the cartesian product
	if (placeholders.length > 0) {
		let variations = cartesian(placeholders);

		if (!exhaustiveUtterances) {
			variations = expandSlotValues(variations, slotValues);
		}

		// Substitute each combination back into the original string
		for (const values of variations) {
			// Replace numeric placeholders
			let utterance = str.replace(/\{(\d+)\}/g, (match, p1) => values[p1]);
			// Replace slot placeholders
			utterance = utterance.replace(/\{(.*?)\}/g, (match, p1) => (isSlotLiteral(match) ? match : `{${values[slotmap[p1]]}|${p1}}`));
			utterances.push(utterance);
		}
	} else {
		utterances = [str];
	}

	// Convert all {-|Name} to {Name} to accomodate slot literals
	for (const [idx, utterance] of utterances.entries()) {
		utterances[idx] = utterance.replace(/\{\-\|/g, '{');
	}

	return utterances;
}
