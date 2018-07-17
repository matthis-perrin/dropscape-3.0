import {SlackAccount} from "./models";

function capitalize(value: string): string {
  if (value.length === 0) {
    return '';
  }
  return value[0].toUpperCase() + value.slice(1);
}

function makeAccountFromName(name: string): SlackAccount {
  return {
    name,
    label: name.split('-').map(capitalize).join(' '),
    email: `dropscape3+${name}@gmail.com`,
  }
}

export const decoyAccounts = [
  'bad-raccoon',
  'bald-mouse',
  'timid-turtle',
].map(makeAccountFromName);
