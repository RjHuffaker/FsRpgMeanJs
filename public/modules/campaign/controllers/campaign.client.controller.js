'use strict';

angular.module('campaign').controller('CampaignController', ['$scope', 'Socket',
	function($scope, Socket) {
		
		Socket.on('init', function (data) {
			$scope.name = data.name;
			$scope.users = data.users;
		});

		Socket.on('send:message', function (message) {
			$scope.messages.push(message);
		});

		Socket.on('change:name', function (data) {
			changeName(data.oldName, data.newName);
		});

		Socket.on('user:join', function (data) {
			$scope.messages.push({
				user: 'chatroom',
				text: 'User ' + data.name + ' has joined.'
			});
			$scope.users.push(data.name);
		});

		  // add a message to the conversation when a user disconnects or leaves the room
		Socket.on('user:left', function (data) {
			$scope.messages.push({
				user: 'chatroom',
				text: 'User ' + data.name + ' has left.'
			});
			var i, user;
			for (i = 0; i < $scope.users.length; i++) {
				user = $scope.users[i];
				if (user === data.name) {
					$scope.users.splice(i, 1);
					break;
				}
			}
		});
		
		// Private helpers
		// ===============

		var changeName = function (oldName, newName) {
			// rename user in list of users
			var i;
			for (i = 0; i < $scope.users.length; i++) {
				if ($scope.users[i] === oldName) {
					$scope.users[i] = newName;
				}
			}

			$scope.messages.push({
				user: 'chatroom',
				text: 'User ' + oldName + ' is now known as ' + newName + '.'
			});
		};

		// Methods published to the scope
		// ==============================

		$scope.changeName = function () {
			Socket.emit('change:name', {
				name: $scope.newName
			}, function (result) {
				if (!result) {
					alert('There was an error changing your name');
				} else {

					changeName($scope.name, $scope.newName);

					$scope.name = $scope.newName;
					$scope.newName = '';
				}
			});
		};

		$scope.messages = [
			{user: 'Test User', text: 'Text Text'}
		];

		$scope.sendMessage = function () {
			Socket.emit('send:message', {
				message: $scope.message
			});

			// add the message to our model locally
			$scope.messages.push({
				user: $scope.name,
				text: $scope.message
			});

			// clear message box
			$scope.message = '';
		};
		
	}]);
