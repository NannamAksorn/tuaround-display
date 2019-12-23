import io from 'socket.io-client';

const socket = io('https://service.mappico.co.th');

socket.emit('room', 'THAMMATRANS');
const ngvListener = (callback) => socket.on('TU-NGV', callback);
export default ngvListener;
