import JsonDB = require('node-json-db');
import {Team} from './models';

const db = new JsonDB('db.json', true, true);

export const DB = {
  loadTeams: function(): Team[] {
    try {
      return db.getData('/teams');
    } catch {
      return [];
    }
  },
  saveTeams: function(teams: Team[]): void {
    db.push('/teams', teams);
  }
}
