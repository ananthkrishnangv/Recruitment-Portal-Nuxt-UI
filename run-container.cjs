const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
ssh.connect({host: '10.10.200.53', username: 'root', password: 'Dda5a3d52a#4815'}).then(async () => {
  const script = `
    podman rm -f recruitment-portal-app || true
    podman run -d --name recruitment-portal-app --network mcvlan1 --ip 10.30.0.99 -p 3000:3000 -e DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" --restart unless-stopped recruitment-portal
  `;
  const res = await ssh.execCommand(script);
  console.log('STDOUT:', res.stdout);
  console.log('STDERR:', res.stderr);
  ssh.dispose();
});
