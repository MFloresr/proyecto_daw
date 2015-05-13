'use strict';

// Configuring the Articles module
angular.module('portatiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Portatiles', 'portatiles', 'dropdown', '/portatiles(/create)?');
		Menus.addSubMenuItem('topbar', 'portatiles', 'List Portatiles', 'portatiles');
		Menus.addSubMenuItem('topbar', 'portatiles', 'New Portatile', 'portatiles/create');
	}
]);