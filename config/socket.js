'use strict';

// export function for listening to the socket
module.exports = function(socket) {
	var name;
	
	var users = [];
	
	var messages = [];
	
	socket.on('user:init', function(data){
		name = data.name;
		messages.push(
			{user: 'chatroom', text: name+'has joined.'}
		);
		
		socket.emit('user:init', {
			users: users,
			messages: messages
		});
		
		socket.broadcast.emit('user:join', {
			name: name,
			users: users
		});
	});
	
	
	// broadcast a user's message to other users
	socket.on('send:message', function (data) {
		messages.push(data);
		socket.broadcast.emit('send:message', data);
	});
	
	// clean up when a user leaves, and broadcast it to other users
	socket.on('disconnect', function () {
		socket.broadcast.emit('user:left', {
			name: name
		});
	});
};
