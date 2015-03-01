'use strict';

// export function for listening to the socket
module.exports = function(socket) {
	var name;
	
	var users = [];
	
	var messages = [];
	
	var isHost = function(){
		return(name === users[0]);
	};
	
	socket.on('user:init', function(data){
		console.log(data);
		name = data.name;
		users.push(name);
		
		messages.push({
			user: 'chatroom',
			text: name+'has joined.'
		});
		
		socket.broadcast.emit('user:join', {
			name: name
		});
	});
	
	socket.on('user:join', function(data){
		users.push(data.name);
		if(isHost){
			console.log('host');
		}
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
