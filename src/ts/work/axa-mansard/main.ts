import { initTranslator } from './translator.js';
import { initSettlement } from './settlement.js';
import { initTurnaround } from './turnaround.js';

const translator = document.querySelector<HTMLElement>('[data-axa-translator]');
const settlement = document.querySelector<HTMLElement>('[data-axa-settlement]');
const turnaround = document.querySelector<HTMLElement>('[data-axa-turnaround]');
if (translator) initTranslator(translator);
if (settlement) initSettlement(settlement);
if (turnaround) initTurnaround(turnaround);
