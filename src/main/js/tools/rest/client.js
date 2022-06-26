'use strict';

var rest = require('rest');
var defaultRequest = require('rest/interceptor/defaultRequest');
var mime = require('rest/interceptor/mime');
var uriTemplateInterceptor = require('../api/uriTemplateInterceptor');
var errorCode = require('rest/interceptor/errorCode');
var baseRegistry = require('rest/mime/registry');
var uriListConverter = require('../api/uriListConverter');
var applicationType = require('rest/mime/type/application/hal');

var registry = baseRegistry.child();

registry.register('text/uri-list', uriListConverter);
registry.register('application/hal+json', applicationType);
registry.register('text/csv', {
    read: function(str) {
        // do string to object conversions 
        return {
			data: str
		};
    },
    write: function(str) {
        return str;
    }});

module.exports = rest
		.wrap(mime, { registry: registry })
		.wrap(uriTemplateInterceptor)
		.wrap(errorCode)
		.wrap(defaultRequest, { headers: { 'Accept': 'application/hal+json' }});
