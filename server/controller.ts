import {teams} from './lib';
import {SevArtwork, Team, VideoStatus, SlackUser} from './models';
import * as Slack from './slack';

export function createTeam(teamName: string, duration: number): void {
  const team: Team = {
    id: Math.floor(Math.random() * 1e10),
    name: teamName,
    creationTime: new Date().getTime(),
    startTime: undefined,
    endTime: undefined,
    deleted: false,
    pauses: [],
    duration,
    videoStatus: VideoStatus.NotPlayed,
    isPresenting: false,
  };
  teams.update(team);
}

export function startTeamTimer(teamName: string): void {
  const team = teams.get(teamName);
  if (!team) {
    return;
  }
  if (!team.startTime) {
    team.startTime = new Date().getTime();
  } else {
    const pause = team.pauses.filter(p => p.endTime === undefined)[0];
    if (pause) {
      pause.endTime = new Date().getTime();
    }
  }
  teams.update(team);
}
export function pauseTeamTimer(teamName: string): void {
  const team = teams.get(teamName);
  if (!team) {
    return;
  }
  const pause = team.pauses.filter(p => p.endTime === undefined)[0];
  if (!pause) {
    team.pauses.push({startTime: new Date().getTime()});
  }
  teams.update(team);
}
export function resetTeamTimer(teamName: string): void {
  const team = teams.get(teamName);
  if (!team) {
    return;
  }
  delete team.startTime;
  delete team.endTime;
  team.pauses = [];
  team.videoStatus = VideoStatus.NotPlayed;
  teams.update(team);
}
export function updateTeamDuration(teamName: string, durationDelta: number): void {
  const team = teams.get(teamName);
  if (!team) {
    return;
  }
  team.duration += durationDelta;
  teams.update(team);
}
export function markTeamWin(teamName: string): void {
  const team = teams.get(teamName);
  if (!team) {
    return;
  }
  const now = new Date().getTime();
  const pause = team.pauses.filter(p => p.endTime === undefined)[0];
  if (pause) {
    pause.endTime = now;
  }
  team.endTime = now;
  teams.update(team);
}
export function deleteTeam(teamName: string): void {
  const team = teams.get(teamName);
  if (!team) {
    return;
  }
  team.deleted = true;
  teams.update(team);
}

export function setVideoStatus(teamName: string, videoStatus: VideoStatus): void {
  const team = teams.get(teamName);
  if (!team) {
    return;
  }
  team.videoStatus = videoStatus;
  teams.update(team);
}

export function setIsPresenting(teamName: string): void {
  const teamsToUpdate = teams.all()
    .filter(t => t.isPresenting)
    .map(t => ({...t, isPresenting: false}));
  teamsToUpdate.push({...teams.get(teamName), isPresenting: true});
  teams.update(...teamsToUpdate);
}

export function listTeams(): Team[] {
  return teams.fetch();
}

export function handleSlackMessage(userId: string, text: string, channel: string): void {
  console.log(userId, text, channel)
  Slack.userInfo(userId, (user: SlackUser) => {
    if (user && user.realName) {
      const isTeam = listSevArtworks().filter(a => a.label === user.realName)[0] !== undefined;
      if (isTeam) {
        
      }
    }
  })
}

export function listSevArtworks(): SevArtwork[] {
  return [
    {name: 'Adaptable_Shrimp', label: 'Adaptable Shrimp'},
    {name: 'Agreeable_Rhinoceros', label: 'Agreeable Rhinoceros'},
    {name: 'Blistering_Dunlin', label: 'Blistering Dunlin'},
    {name: 'Challenging_Tiger', label: 'Challenging Tiger'},
    {name: 'Charming_Bat', label: 'Charming Bat'},
    {name: 'Communicative_Gerbil', label: 'Communicative Gerbil'},
    {name: 'Corpulent_Snorlax', label: 'Corpulent Snorlax'},
    {name: 'Courteous_Spider', label: 'Courteous Spider'},
    {name: 'Cowardly_Buffalo', label: 'Cowardly Buffalo'},
    {name: 'Creative_Eagle', label: 'Creative Eagle'},
    {name: 'Creeping_Wolverine', label: 'Creeping Wolverine'},
    {name: 'Decisive_Goose', label: 'Decisive Goose'},
    {name: 'Delighted_Duck', label: 'Delighted Duck'},
    {name: 'Delinquent_Seahorse', label: 'Delinquent Seahorse'},
    {name: 'Determinde_Shark', label: 'Determinde Shark'},
    {name: 'Entertaining_Beaver', label: 'Entertaining Beaver'},
    {name: 'Happy_Hare', label: 'Happy Hare'},
    {name: 'Impartial_Butterfly', label: 'Impartial Butterfly'},
    {name: 'Joyful_Camel', label: 'Joyful Camel'},
    {name: 'Lachrymose_Camel', label: 'Lachrymose Camel'},
    {name: 'Meandering_Elk', label: 'Meandering Elk'},
    {name: 'Modest_Goat', label: 'Modest Goat'},
    {name: 'Mysterious_Wombat', label: 'Mysterious Wombat'},
    {name: 'Neat_Cod', label: 'Neat Cod'},
    {name: 'Nefarious_Seadragon', label: 'Nefarious Seadragon'},
    {name: 'Polite_Salamander', label: 'Polite Salamander'},
    {name: 'Rambunctious_Wallaby', label: 'Rambunctious Wallaby'},
    {name: 'Relaxed_Porcupine', label: 'Relaxed Porcupine'},
    {name: 'Romantic_Hedgehog', label: 'Romantic Hedgehog'},
    {name: 'Selfish_Hedgehog', label: 'Selfish Hedgehog'},
    {name: 'Sensible_Caterpillar', label: 'Sensible Caterpillar'},
    {name: 'Severe_Tiger', label: 'Severe Tiger'},
    {name: 'Shy_Lobster', label: 'Shy Lobster'},
    {name: 'Slick_Loris', label: 'Slick Loris'},
    {name: 'Smelly_Wren', label: 'Smelly Wren'},
    {name: 'Soaring_Corgi', label: 'Soaring Corgi'},
    {name: 'Sparkling_Emu', label: 'Sparkling Emu'},
    {name: 'Thrifty_Raccoon', label: 'Thrifty Raccoon'},
  ];
}
