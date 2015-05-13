'use strict';

//Componentes service used to communicate Componentes REST endpoints
angular.module('componentes').factory('Componentes', ['$resource',
	function($resource) {
		return $resource('componentes/:componenteId', { componenteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);