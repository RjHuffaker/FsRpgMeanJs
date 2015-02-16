'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
		var mSocket = socketFactory({
			ioSocket: socket
		});
		return mSocket;
    }
]);