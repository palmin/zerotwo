// import { EventEmitter } from 'events';
// import * as net from 'net';
// import { v4 as uuid } from 'uuid';

// enum OPCODES {
//   HANDSHAKE = 0,
//   FRAME = 1,
//   CLOSE = 2,
//   PING = 3,
//   PONG = 4,
// }

// function getIPCPath(id: number): string {
//   if (process.platform === 'win32') {
//     return `\\\\?\\pipe\\discord-ipc-${id}`;
//   }

//   const {
//     env: {
//       XDG_RUNTIME_DIR,
//       TMPDIR,
//       TMP,
//       TEMP,
//     },
//   } = process;
//   const prefix = XDG_RUNTIME_DIR || TMPDIR || TMP || TEMP || '/tmp';

//   return `${prefix.replace(/\/$/, '')}/discord-ipc-${id}`;
// }

// function getIPC(id: number = 0): Promise<net.Socket> {
//   return new Promise((resolve, reject) => {
//     const path = getIPCPath(id);
//     const onError = async () => {
//       if (id < 10) {
//         resolve(await getIPC(id + 1));
//       } else {
//         reject(new Error('Could not connect'));
//       }
//     };

//     const socket = net.createConnection(path, () => {
//       socket.removeListener('error', onError);
//       resolve(socket);
//     });

//     socket.once('error', onError);
//   });
// }

// export class IPCTransport extends EventEmitter {
//   private client!: any;

//   private socket: net.Socket | null;

//   private working: {
//     full: any,
//     opCode: OPCODES | undefined,
//   } = {
//     full: '',
//     opCode: undefined,
//   };

//   // @TODO Change Client any to Client RPC Options
//   constructor(client: any) {
//     super();

//     this.client = client;
//     this.socket = null;
//   }

//   public async connect() {
//     const self = this;
//     const socket = this.socket = await getIPC();

//     socket.on('close', this.onClose.bind(this));
//     socket.on('error', this.onClose.bind(this));

//     this.emit('open');

//     socket.write(this.encode(OPCODES.HANDSHAKE, {
//       v: 1,
//       client_id: this.client.clientId,
//     }));

//     socket.pause();
//     socket.on('readable', () => {
//       self.decode(socket, ({ opCode, data }: { opCode: OPCODES, data: any }) => {
//         switch (opCode) {
//           case OPCODES.PING:
//             this.send(data, OPCODES.PONG);
//             break;
//           case OPCODES.FRAME:
//             if (!data) {
//               return;
//             }

//             this.emit('message', data);
//             break;
//           case OPCODES.CLOSE:
//             this.emit('close', data);
//             break;
//           default:
//             break;
//         }
//       });
//     });
//   }

//   public send(data: any, op = OPCODES.FRAME) {
//     (this.socket as net.Socket).write(this.encode(op, data));
//   }

//   public close() {
//     this.send({}, OPCODES.CLOSE);
//     (this.socket as net.Socket).end();
//   }

//   public encode(opCode: OPCODES, data: any): Buffer {
//     const stringedData = JSON.stringify(data);
//     const len = Buffer.byteLength(stringedData);
//     const packet = Buffer.alloc(8 + len);

//     packet.writeInt32LE(opCode, 0);
//     packet.writeInt32LE(len, 4);

//     packet.write(stringedData, 8, len);

//     return packet;
//   }

//   public decode(socket: net.Socket, callback: ({ opCode, data }: { opCode: any, data: any }) => any): void {
//     const packet: Buffer = socket.read();
//     if (!packet) {
//       return;
//     }

//     let { opCode } = this.working;
//     let raw: any;
//     if (this.working.full === '') {
//       opCode = this.working.opCode = packet.readInt32LE(0);
//       const len = packet.readInt32LE(4);
//       raw = packet.slice(8, len + 8);
//     } else {
//       raw = packet.toString();
//     }

//     try {
//       const data = JSON.parse(this.working.full + raw);
//       callback({ opCode, data });

//       this.working.full = '';
//       this.working.opCode = undefined;
//     } catch (error) {
//       this.working.full += raw;
//     }

//     this.decode(socket, callback);
//   }

//   private ping() {
//     this.send(uuid(), OPCODES.PING);
//   }

//   private onClose(e: any) {
//     this.emit('close', e);
//   }
// }
