import { emitKeypressEvents } from 'readline';

// emitKeypressEvents(process.stdin)
// process.stdin.setRawMode(true);

// process.stdin.on('keypress', ((_, { name, ctrl }) => {
//   switch(true) {
//     case name === 'c' && ctrl:
//       process.exit(0)
//   }
// }))
process.stdin.on('data', (...args) => console.log('data', String(args[0])))