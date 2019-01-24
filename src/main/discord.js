import { Client } from 'discord-rpc';

const clientId = '442434607435087872';
const imageKey = 'zerotwo';
const imageText = 'Test';
const client = new Client({ transport: 'ipc' });

async function setActivity() {
  if (!client) {
    return;
  }

  client.setActivity({
    details: 'Watching Test',
    state: 'via ZeroTwo',
    largeImageKey: imageKey,
    largeImageText: imageText,
    instance: false,
  });
}

export default () => {
  client.on('ready', () => {
    setActivity();

    // activity can only be set every 15 seconds
    setInterval(() => {
      setActivity();
    }, 15e3);
  });

  // eslint-disable-next-line no-console
  client.login({ clientId }).catch(console.error);
};
