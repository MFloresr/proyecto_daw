'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Torre Schema
 */
var TorreSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Torre name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Torre', TorreSchema);