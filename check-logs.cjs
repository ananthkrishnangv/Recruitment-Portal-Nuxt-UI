const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
ssh.connect({host: '10.10.200.53', username: 'root', password: 'Dda5a3d52a#4815'}).then(async () => {
  const script = `
    echo "=== Container Status ==="
    podman ps -a --filter name=recruitment-portal-app
    echo "\\n=== Container Logs ==="
    podman logs recruitment-portal-app --tail 50
  `;
  const res = await ssh.execCommand(script);
  console.log('STDOUT:\\n', res.stdout);
  console.log('STDERR:\\n', res.stderr);
  ssh.dispose();
});
