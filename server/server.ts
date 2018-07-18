import * as express from 'express';
import * as controller from './controller';

const PORT = 80;
const HOST = '0.0.0.0';


const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static('../client/dist'));
app.use('/', express.static('../client/dist/index.html'));
app.use('/admin', express.static('../client/dist/index.html'));

app.use(function(req, res, next) {
    console.log(`[${new Date()}] ${req.method} ${req.path} ${JSON.stringify(req.body)}`);
    next();
});

app.post('/teams/create', (req, res) => res.send(
  controller.createTeam(req.body.teamName, req.body.duration)
));
app.get('/teams/list', (_, res) => res.send(
  controller.listTeams()
));
app.post('/team/start', (req, res) => res.send(
  controller.startTeamTimer(req.body.teamName)
));
app.post('/team/pause', (req, res) => res.send(
  controller.pauseTeamTimer(req.body.teamName)
));
app.post('/team/reset', (req, res) => res.send(
  controller.resetTeamTimer(req.body.teamName)
));
app.post('/team/update-duration', (req, res) => res.send(
  controller.updateTeamDuration(req.body.teamName, req.body.durationDelta)
));
app.post('/team/mark-win', (req, res) => res.send(
  controller.markTeamWin(req.body.teamName)
));
app.post('/team/delete', (req, res) => res.send(
  controller.deleteTeam(req.body.teamName)
));
app.post('/team/set-video-status', (req, res) => res.send(
  controller.setVideoStatus(req.body.teamName, req.body.videoStatus)
));
app.post('/team/present', (req, res) => res.send(
  controller.setIsPresenting(req.body.teamName)
));
app.get('/sev-artworks/list', (_, res) => res.send(
  controller.listSevArtworks()
));

app.post('/slack', (req, res) => {
  if (req.body.challenge) {
    res.send(req.body.challenge)
  }
  if (req.body.event && req.body.event.type === 'message') {
    controller.handleSlackMessage(req.body.event.user, req.body.event.text, req.body.event.authedUsers);
  }
  res.send();
})

app.get('/slack/oauth', (req, res) => res.send())

app.listen(PORT, HOST, () => console.log(`Dropscape 3.0 app listening on ${HOST}:${PORT}!`));

import {adminAccount, puzzleAccounts} from './slack-accounts';
import * as Slack from './slack';

// function loadUsers(users: string[], callback: () => void): void {
//   if (users.length === 0) {
//     callback();
//   }
//   const user = puzzleAccounts[users[0]];
//   Slack.fetchAccessToken(user, (token) => {
//     user.apiToken = token;
//     loadUsers(users.slice(1), callback)
//   });
// }

// rusty,mink { ok: true,
//   access_token:
//    'xoxp-399994521443-401361256839-399629906512-ff7bdfce4d0e7aad3357aaddfaf91db1',
//   scope: 'identify,im:history,im:read',
//   user_id: 'UBTAM7JQP',
//   team_name: 'Dropscape 3.0',
//   team_id: 'TBRV8FBD1' }
// swamp,corgi { ok: true,
//   access_token:
//    'xoxp-399994521443-400081912932-399629145392-04779bb12262cf4e34d9fb3210cc5620',
//   scope: 'identify,im:history,im:read',
//   user_id: 'UBS2DSUTE',
//   team_name: 'Dropscape 3.0',
//   team_id: 'TBRV8FBD1' }
// bad,raccoon { ok: true,
//   access_token:
//    'xoxp-399994521443-401163813303-400122084003-a68c32457d8073d450ef2bf3cb398229',
//   scope:
//    'identify,incoming-webhook,im:history,im:read,chat:write:user',
//   user_id: 'UBT4TPX8X',
//   team_name: 'Dropscape 3.0',
//   team_id: 'TBRV8FBD1' }
// whistling,hummingbird { ok: true,
//   access_token:
//    'xoxp-399994521443-401361473559-401665134486-6ebbc9a5270bc5660b9e02ed6b2a60cd',
//   scope: 'identify,im:history,im:read,chat:write:user',
//   user_id: 'UBTAMDXGF',
//   team_name: 'Dropscape 3.0',
//   team_id: 'TBRV8FBD1' }


// Slack.fetchAccessToken(puzzleAccounts.SwampCorgi)
// Slack.fetchAccessToken(puzzleAccounts.RustyMink)
// Slack.fetchAccessToken(puzzleAccounts.WhistlingHummingbird)
// Slack.fetchAccessToken(adminAccount)

// Slack.listUsers(users => {
//   const WhistlingHummingbirdUser = users.filter(u => u.realName === puzzleAccounts.WhistlingHummingbird.label)[0];
//   const RustyMinkAccount = puzzleAccounts.RustyMink;
//   Slack.sendMessage('Hi Whistling Hummingbird, this is Rusty Mink :)', RustyMinkAccount, WhistlingHummingbirdUser);
// });
