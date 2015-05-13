'use strict';

// Configuring the Articles module
angular.module('torres').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Torres', 'torres', 'dropdown', '/torres(/create)?');
		Menus.addSubMenuItem('topbar', 'torres', 'List Torres', 'torres');
		Menus.addSubMenuItem('topbar', 'torres', 'New Torre', 'torres/create');
	}
]);