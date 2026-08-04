import EventEmitter from 'node:events';

export default defineNitroPlugin(() => {
    // Bumps the warning threshold so socket streams can read 50KB+ files cleanly
    EventEmitter.defaultMaxListeners = 50;
});