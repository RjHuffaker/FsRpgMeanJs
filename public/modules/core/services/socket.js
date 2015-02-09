'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
		var mySocket = socketFactory();
		 mySocket.forward('trait.created');
		 mySocket.forward('trait.deleted');
		return mySocket;
    }
]);