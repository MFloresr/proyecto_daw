'use strict';

// Configuring the Articles module
angular.module('moviles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Moviles', 'moviles', 'dropdown', '/moviles(/create)?');
		Menus.addSubMenuItem('topbar', 'moviles', 'List Moviles', 'moviles');
		Menus.addSubMenuItem('topbar', 'moviles', 'New Movile', 'moviles/create');
	}
]);