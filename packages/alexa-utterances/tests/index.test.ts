import { generateUtterances } from '../src/index.js';

describe('generateUtterances', () => {
	test('basic usage', () => {
		const dictionary = {};
		const slots = {};
		const template = 'do the thing';

		const result = generateUtterances(template, slots, dictionary);
		expect(result).toEqual(['do the thing']);
	});

	test('optional terms', () => {
		const dictionary = {};
		const slots = {};
		const template = 'do {it |}';

		const result = generateUtterances(template, slots, dictionary);
		expect(result).toEqual(['do it ', 'do ']);
	});

	test('dictionary expansion', () => {
		const dictionary = { adjustments: ['dim', 'brighten'] };
		const slots = { Adjustment: 'LITERAL' };
		const template = '{adjustments|Adjustment} the light';

		const result = generateUtterances(template, slots, dictionary);
		expect(result).toEqual(['{dim|Adjustment} the light', '{brighten|Adjustment} the light']);
	});

	test('number range expansion', () => {
		const dictionary = {};
		const slots = { Brightness: 'NUMBER' };
		const template = 'set brightness to {1-3|Brightness}';

		const result = generateUtterances(template, slots, dictionary);
		expect(result).toEqual(['set brightness to {one|Brightness}', 'set brightness to {two|Brightness}', 'set brightness to {three|Brightness}']);
	});

	test('exhaustive vs non-exhaustive expansion', () => {
		const dictionary = { movie_names: ['star wars', 'inception', 'gattaca', 'the matrix'] };
		const slots = { MOVIE: 'LITERAL' };
		const template = '{foo|bar|baz} {foo|bar|baz} {movie_names|MOVIE}';
		const result = generateUtterances(template, slots, dictionary);
		expect(result).toEqual([
			'foo foo {star wars|MOVIE}',
			'bar foo {inception|MOVIE}',
			'baz foo {gattaca|MOVIE}',
			'foo bar {the matrix|MOVIE}',
			'bar bar {star wars|MOVIE}',
			'baz bar {inception|MOVIE}',
			'foo baz {gattaca|MOVIE}',
			'bar baz {the matrix|MOVIE}',
			'baz baz {star wars|MOVIE}'
		]);

		const result2 = generateUtterances(template, slots, dictionary, true);
		expect(result2).toEqual([
			'foo foo {star wars|MOVIE}',
			'bar foo {star wars|MOVIE}',
			'baz foo {star wars|MOVIE}',
			'foo bar {star wars|MOVIE}',
			'bar bar {star wars|MOVIE}',
			'baz bar {star wars|MOVIE}',
			'foo baz {star wars|MOVIE}',
			'bar baz {star wars|MOVIE}',
			'baz baz {star wars|MOVIE}',
			'foo foo {inception|MOVIE}',
			'bar foo {inception|MOVIE}',
			'baz foo {inception|MOVIE}',
			'foo bar {inception|MOVIE}',
			'bar bar {inception|MOVIE}',
			'baz bar {inception|MOVIE}',
			'foo baz {inception|MOVIE}',
			'bar baz {inception|MOVIE}',
			'baz baz {inception|MOVIE}',
			'foo foo {gattaca|MOVIE}',
			'bar foo {gattaca|MOVIE}',
			'baz foo {gattaca|MOVIE}',
			'foo bar {gattaca|MOVIE}',
			'bar bar {gattaca|MOVIE}',
			'baz bar {gattaca|MOVIE}',
			'foo baz {gattaca|MOVIE}',
			'bar baz {gattaca|MOVIE}',
			'baz baz {gattaca|MOVIE}',
			'foo foo {the matrix|MOVIE}',
			'bar foo {the matrix|MOVIE}',
			'baz foo {the matrix|MOVIE}',
			'foo bar {the matrix|MOVIE}',
			'bar bar {the matrix|MOVIE}',
			'baz bar {the matrix|MOVIE}',
			'foo baz {the matrix|MOVIE}',
			'bar baz {the matrix|MOVIE}',
			'baz baz {the matrix|MOVIE}'
		]);
	});

	test('raw curly braces for custom slot types', () => {
		const dictionary = {};
		const slots = { Artist: 'CUSTOM_TYPE' };
		const template = '{my|your} {favorite|least favorite} fruit is {-|Fruit}';

		const result = generateUtterances(template, slots, dictionary);
		expect(result).toEqual([
			'my favorite fruit is {Fruit}',
			'your favorite fruit is {Fruit}',
			'my least favorite fruit is {Fruit}',
			'your least favorite fruit is {Fruit}'
		]);
	});
});
