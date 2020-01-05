/* eslint-disable no-console */
import Dexa from '../src/dexa';

const dexa = new Dexa();

console.group('Skill Data');
console.log('\nIntent Schema\n');
console.log(dexa.schemas.skillBuilder());
console.log('\nUtterances\n');
console.log(dexa.utterances());
console.groupEnd();
