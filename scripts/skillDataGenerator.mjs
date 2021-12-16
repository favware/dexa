import Dexa from '../dist/dexa.js';

const dexa = new Dexa.default();

console.group('Skill Data');
console.log('\nIntent Schema\n');
console.log(dexa.schemas.skillBuilder());
console.log('\nUtterances\n');
console.log(dexa.utterances());
console.groupEnd();
