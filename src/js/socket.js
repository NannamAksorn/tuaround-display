import io from 'socket.io-client';

// const socket = io('https://service.mappico.co.th');
const socket = io();

// socket.emit('room', 'THAMMATRANS');
// socket.emit('room', 'NGV');
export const ngvListener = (callback) => socket.on('TU-NGV', callback);
export const iconAddListener = (callback) => socket.on('ICON_ADD', callback);
export const forwardArrivalListener = (callback) => socket.on('P_4', callback);
