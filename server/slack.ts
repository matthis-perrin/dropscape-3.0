import * as request from 'request';
import { SlackUser, SlackAccount } from './models';

const TOKEN = 'xoxp-399994521443-401163813303-400581310869-36e84e6a367b54da6eaebb15be78f87e';

function apiCall(method: string, params: {[key: string]: string | boolean}, callback: (res: any) => void, retryOnFail: boolean = true): void {
  request.post({
    url: `https://slack.com/api/${method}`,
    form: params,
  }, (err, httpResponse, body) => {
    let errored = false;
    if (err) {
      errored = true;
    } else {
      try {
        const res = JSON.parse(body)
        console.error(method, params, res);
        callback(res);
      } catch(e) {
        err = e;
        errored = true;
      }
    }
    if (errored && retryOnFail) {
      console.error(err, method, params)
      setTimeout(() => {
        apiCall(method, params, callback, false)
      }, 1000);
    }
  })
}

export function channelInfo(channelId: string, callback: (data: any) => void): void {
  apiCall('channels.info', {token: TOKEN, channel: channelId}, channelRes => {
    callback(channelRes['channel']);
  });
}

function parseSlackUser(d: any): SlackUser {
  return {
    id: d['id'],
    name: d['name'],
    realName: d['real_name'],
    displayName: d['profile']['real_name'],
    email: d['profile']['email'],
  }
}

export function allUserNameById(callback: (data: {[id: string]: string}) => void): void {
  apiCall('users.list', {token: TOKEN}, usersList => {
    const usersByName = {};
    for (let user of usersList['members']) {
      usersByName[user['id']] = user['real_name'];
    }
    callback(usersByName);
  });
}

export function listUsers(callback: (users: SlackUser[]) => void) {
  apiCall('im.list', {token: TOKEN}, imList => {
    const ims = imList['ims'];
    apiCall('users.list', {token: TOKEN}, usersList => {
      const users = usersList['members']
        .map(d => {
          try {
            return {
              id: d['id'],
              name: d['name'],
              realName: d['real_name'],
              displayName: d['profile']['real_name'],
              email: d['profile']['email'],
              imId: ims.filter(im => im['user'] === d['id'])[0]['id'],
            }
          } catch {
            return undefined
          }
        })
        .filter(Boolean);
      callback(users);
    });
  });
}

export function fetchAccessToken(account: SlackAccount): void {
  apiCall('oauth.access', {
    client_id: '399994521443.399534455952',
    client_secret: 'dace619f9facb08789aff4714b172513',
    code: account.apiToken,
  }, (res) => {
    console.log(account.name, res);
  })
}

export function sendMessage(text: string, fromAccount: SlackAccount, toUserId: string): void {
  apiCall('im.open', {
    token: fromAccount.apiToken,
    user: toUserId,
  }, (res) => {
    const channelId = res.channel.id;
    apiCall('chat.postMessage', {
      token: fromAccount.apiToken,
      channel: channelId,
      text,
      as_user: true,
    }, (res) => {
      console.log(res);
    }, false)
  }, false)
}
