import io from 'socket.io-client';
const socket = io(
{
  secure: true,
	path: '/api/socket.io',
});

export const ngvListener = (callback) => socket.on('TU-NGV', callback);
export const iconAddListener = (callback) => socket.on('ICON_ADD', callback);
export const forwardArrivalListener = (callback) => socket.on('P_4', callback);
