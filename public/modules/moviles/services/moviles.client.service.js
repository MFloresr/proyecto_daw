'use strict';

//Moviles service used to communicate Moviles REST endpoints
angular.module('moviles').factory('Moviles', ['$resource',
	function($resource) {
		return $resource('moviles/:movileId', { movileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);