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
  const handle = name.split('-').join('');
  return {
    name: handle,
    label: name.split('-').map(capitalize).join(' '),
    email: `dropscape3+${name}@gmail.com`,
    apiToken,
  }
}

export const adminAccount = makeAccountFromName(['bad-raccoon', 'xoxp-399994521443-401163813303-401440247143-52fac60d9a73f9e51536292caba748da'])

export const decoyAccounts = [
].map(makeAccountFromName);

//https://dropscape3.slack.com/?redir=%2Foauth%3Fclient_id%3D399994521443.399534455952%26redirect_uri%3Dhttp%3A%2F%2F18.222.203.244%2Fslack%2Foauth%26scope%3Dim%253Aread%252Cim%253Ahistory%252Cchat%253Awrite%253Auser%252Cim%253Awrite

export const puzzleAccounts = {
  SwampCorgi: makeAccountFromName(['swamp-corgi', 'xoxp-399994521443-400081912932-399881149665-8038dc6abbc283078aedd3a1de3bde05']),
  RustyMink: makeAccountFromName(['rusty-mink', 'xoxp-399994521443-401361256839-400575889893-200f6c82393ebcb0ef0936cf93078532']),
  WhistlingHummingbird: makeAccountFromName(['whistling-hummingbird', 'xoxp-399994521443-401361473559-400304170611-3d590aff978a2177a89a60d9a85871ef']),
};
