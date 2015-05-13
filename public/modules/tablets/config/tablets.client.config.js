'use strict';

// Configuring the Articles module
angular.module('tablets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tablets', 'tablets', 'dropdown', '/tablets(/create)?');
		Menus.addSubMenuItem('topbar', 'tablets', 'List Tablets', 'tablets');
		Menus.addSubMenuItem('topbar', 'tablets', 'New Tablet', 'tablets/create');
	}
]);