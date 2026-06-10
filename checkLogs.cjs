const { Client } = require('ssh2');

const sshConfig = {
  host: '10.10.200.53',
  port: 22,
  username: 'root',
  password: 'Dda5a3d52a#4815',
  readyTimeout: 10000
};

const client = new Client();
client.on('ready', () => {
  client.exec('podman logs recruitment-portal-app', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      client.end();
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error(data.toString());
    });
  });
}).connect(sshConfig);
