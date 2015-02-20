'use strict';

angular.module('campaign').controller('CampaignController', ['$scope', 'Socket',
	function($scope, Socket) {
		
		$scope.messages = [];
		
		$scope.users = [];
		
		var init = function(){
			$scope.name = window.user.username;
			$scope.messages.push({
				user: '',
				text: $scope.name+' has joined.'
			});
			Socket.emit('user:init', {
				name: window.user.username
			});
		};
		
		Socket.on('user:init', function(data){
			console.log(data);
			for(var message in data.messages){
				$scope.messages.push(message);
			}
			for(var user in data.users){
				$scope.users.push(user);
			}
		});
		
		Socket.on('send:message', function (message) {
			$scope.messages.push(message);
		});

		Socket.on('user:join', function (data) {
			$scope.messages.push({
				user: '',
				text: data.name + ' has joined.'
			});
			$scope.users.push(data.name);
		});

		  // add a message to the conversation when a user disconnects or leaves the room
		Socket.on('user:left', function (data) {
			$scope.messages.push({
				user: 'chatroom',
				text: data.name + ' has left.'
			});
		});

		$scope.messages = [];

		$scope.sendMessage = function () {
			if($scope.message){
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
			}
		};
		
		init();
		
	}]);
