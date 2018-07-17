import {SlackAccount} from "./models";

function capitalize(value: string): string {
  if (value.length === 0) {
    return '';
  }
  return value[0].toUpperCase() + value.slice(1);
}

function makeAccountFromName(data: string[]): SlackAccount {
  const name = data[0];
  const apiToken = data[1];
  const handle = name.split('-').join();
  return {
    name: handle,
    label: name.split('-').map(capitalize).join(' '),
    email: `dropscape3+${name}@gmail.com`,
    apiToken,
  }
}

export const adminAccount = makeAccountFromName(['bad-raccoon', 'xoxp-399994521443-401163813303-400122084003-a68c32457d8073d450ef2bf3cb398229'])

export const decoyAccounts = [
].map(makeAccountFromName);


export const puzzleAccounts = {
  SwampCorgi: makeAccountFromName(['swamp-corgi', 'xoxp-399994521443-400081912932-400507124229-4355ed89fd56c970f08adb6bc56b735d']),
  RustyMink: makeAccountFromName(['rusty-mink', 'xoxp-399994521443-401361256839-400369523074-fadf7e822556812a3831c48464b00e50']),
  WhistlingHummingbird: makeAccountFromName(['whistling-hummingbird', 'xoxp-399994521443-401361473559-399657993024-b6435001770bcd6b1195f8d78170aea5']),
};
