import Dexa from './dexa';

const dexa = new Dexa();

exports.handler = dexa.lambda();
