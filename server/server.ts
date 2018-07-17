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

app.post('/slack', (req, res) => res.send(
  req.body.challenge
))

app.listen(PORT, HOST, () => console.log(`Dropscape 3.0 app listening on ${HOST}:${PORT}!`));

import {decoyAccounts} from './slack-accounts';
console.log(decoyAccounts);
