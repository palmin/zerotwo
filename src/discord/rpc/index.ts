// import { EventEmitter } from 'events';
// import { clearTimeout, setTimeout } from 'timers';
// import { v4 as uuid } from 'uuid';
// import { IPCTransport } from './IPC';

// export enum TransportTypes {
//   IPC = 'ipc',
//   WEBSOCKET = 'websocket',
// }

// enum RPCCommands {
//   SET_ACTIVITY = 'SET_ACTIVITY',
//   DISPATCH = 'DISPATCH',
// }

// enum RPCEvents {
//   READY = 'READY',
// }

// interface RPCClientOptions {
//   transport: TransportTypes;
// }

// interface IActivityArguments {
//   details: string;
//   state: string;
//   startTimestamp: number | undefined;
//   endTimestamp?: number | undefined;
//   largeImageKey: string;
//   largeImageText: string;
//   smallImageKey: string;
//   smallImageText: string;
//   instance: boolean;
// }

// function getPid() {
//   if (typeof process !== 'undefined') {
//     return process.pid;
//   }

//   return null;
// }

// export class RPCClient extends EventEmitter {
//   public clientId!: string;

//   private options!: RPCClientOptions;

//   private expectedNonces: Map<string, { resolve: any, reject: any }>;

//   private transport!: IPCTransport;

//   private connectPromise!: Promise<any>;

//   private user!: any;

//   constructor(options: RPCClientOptions) {
//     super();

//     this.options = options;
//     this.expectedNonces = new Map();
//     this.user = null;
//     this.transport = new IPCTransport(this);
//     this.transport.on('message', this.onRpcMessage.bind(this));
//   }

//   public async login(options: any = {}) {
//     const { clientId }: { clientId: string } = options;
//     await this.connect(clientId);
//     this.emit('ready');
//     return this;
//   }

//   public logoff() {
//     this.destroy();
//   }

//   public async setActivity(options: IActivityArguments, pid = getPid()): Promise<any> {
//     let timestamps = {};
//     let assets = {};
//     const party = {};
//     const secrets = {};

//     if (options.startTimestamp || options.endTimestamp) {
//       timestamps = {
//         start: options.startTimestamp,
//         end: options.endTimestamp,
//       };
//     }

//     if (options.largeImageKey || options.largeImageText || options.smallImageKey || options.smallImageText) {
//       assets = {
//         large_image: options.largeImageKey,
//         large_text: options.largeImageText,
//         small_image: options.smallImageKey,
//         small_text: options.smallImageText,
//       };
//     }

//     return this.request(RPCCommands.SET_ACTIVITY, {
//       pid,
//       activity: {
//         state: options.state,
//         details: options.details,
//         timestamps,
//         assets,
//         party,
//         secrets,
//         instance: !!options.instance,
//       },
//     });
//   }

//   public async clearActivity(pid = getPid()): Promise<any> {
//     return this.request(RPCCommands.SET_ACTIVITY, {
//       pid,
//     });
//   }

//   private connect(clientId: string): Promise<any> {
//     if (this.connectPromise) {
//       return this.connectPromise;
//     }

//     this.connectPromise = new Promise((resolve, reject) => {
//       this.clientId = clientId;
//       const timeout = setTimeout(() => reject(new Error('RPC_CONNECTION_TIMEOUT')), 10e3);
//       timeout.unref();

//       this.once('connected', () => {
//         clearTimeout(timeout);
//         resolve(this);
//       });

//       this.transport.once('close', reject);
//       this.transport.connect().catch(reject);
//     });

//     return this.connectPromise;
//   }

//   private onRpcMessage(message: any) {
//     if (message.cmd === RPCCommands.DISPATCH && message.evt === RPCEvents.READY) {
//       if (message.data.user) {
//         this.user = message.data.user;
//       }
//       this.emit('connected');
//     } else if (this.expectedNonces.has(message.nonce)) {
//       const { resolve, reject } = this.expectedNonces.get(message.nonce) as { resolve: any, reject: any };
//       if (message.evt === 'ERROR') {
//         const e = new Error(message.data.message);
//         (e as any).code = message.data.code;
//         (e as any).data = message.data;
//         reject(e);
//       } else {
//         resolve(message.data);
//       }
//       this.expectedNonces.delete(message.nonce);
//     }
//   }

//   private async request(command: string, options: any, event?: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//       const nonce = uuid();
//       this.transport.send({
//         cmd: command, args: options, evt: event, nonce,
//       });
//       this.expectedNonces.set(nonce, { resolve, reject });
//     });
//   }

//   private async destroy() {
//     this.transport.close();
//   }
// }
