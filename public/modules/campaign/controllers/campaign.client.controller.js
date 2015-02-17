'use strict';

angular.module('campaign').controller('CampaignController', ['$scope', 'Socket',
	function($scope, Socket) {
		
		console.log(window.user);
		
		var init = function(){
			$scope.name = window.user.username;
			Socket.emit('user:init', {
				name: window.user.username
			});
		};
		
		Socket.on('send:message', function (message) {
			$scope.messages.push(message);
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
		});

		$scope.messages = [];

		$scope.sendMessage = function () {
			Socket.emit('send:message', {
				user: $scope.name,
				text: $scope.message
			});

			// add the message to our model locally
			$scope.messages.push({
				user: $scope.name,
				text: $scope.message
			});

			// clear message box
			$scope.message = '';
		};
		
		init();
		
	}]);
