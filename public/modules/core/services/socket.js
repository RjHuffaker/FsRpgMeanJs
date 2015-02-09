'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
		var mSocket = socketFactory();
		 mSocket.forward('card.created');
		 mSocket.forward('card.deleted');
		return mSocket;
    }
]);