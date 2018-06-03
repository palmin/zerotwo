// import discordRpc from 'discord-rpc';

// const clientId = '442434607435087872';
// const imageKey = 'zerotwo';
// const imageText = 'Test';

// export default {
//   mounted() {
//     this.rpc = new discordRpc.Client({
//       transport: 'ipc',
//     });
//     this.rpc.on('ready', () => {
//       // console.debug(`Starting with clientId ${clientId}`);
//       this.updateActivity();
//       setInterval(() => {
//         this.updateActivity();
//       }, 30e3);
//     });
//     // eslint-disable-next-line
//     this.rpc.login(clientId).catch(console.error);
//   },
//   methods: {
//     async updateActivity() {
//       if (!this.rpc) {
//         return;
//       }

//       this.rpc.setActivity({
//         details: 'Watching Test',
//         state: 'via ZeroTwo',
//         largeImageKey: imageKey,
//         largeImageText: imageText,
//         instance: false,
//       });
//       // macOS
//       // exec('ps -ax | grep "\.app/" | grep "/Applications/"');
//       // console.log(`[${new Date().toLocaleTimeString()}] Updated Rich Presence`);
//     },
//   },
//   data() {
//     return {
//       rpc: null,
//     };
//   },
// };
