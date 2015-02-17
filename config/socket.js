'use strict';

// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
	var names = {};

	var claim = function (name) {
		if (!name || names[name]) {
			return false;
		} else {
			names[name] = true;
		return true;
		}
	};

	// find the lowest unused "guest" name and claim it
	var getGuestName = function () {
		var name,
			nextUserId = 1;

		do {
			name = 'Guest ' + nextUserId;
			nextUserId += 1;
		} while (!claim(name));

		return name;
	};

	// serialize claimed names as an array
	var get = function () {
		var res = [];
		for (var user in names) {
			res.push(user);
		}

		return res;
	};

	var free = function (name) {
		if (names[name]) {
			delete names[name];
		}
	};

	return {
		claim: claim,
		free: free,
		get: get,
		getGuestName: getGuestName
	};
}());

// export function for listening to the socket
module.exports = function(socket) {
	var name;
	
	socket.on('user:init', function(data){
		name = data.name;
		socket.broadcast.emit('user:join', {
			name: name
		});
	});
	
	// broadcast a user's message to other users
	socket.on('send:message', function (data) {
		socket.broadcast.emit('send:message', {
			user: data.user,
			text: data.text
		});
	});
	
	// clean up when a user leaves, and broadcast it to other users
	socket.on('disconnect', function () {
		socket.broadcast.emit('user:left', {
			name: name
		});
		userNames.free(name);
	});
};
