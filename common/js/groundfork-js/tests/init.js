"use strict";

var request    = require('request');
var GroundFork = require('../groundfork');

function buildNode(key, secret) {

    var node = {};

    node.config = {
        url                : 'http://localhost:3333/',
        key                : key,
        secret             : secret 
    };
    
    node.store = new GroundFork.BrowserStorage({
        namespace : key
    });
    
    node.api = new GroundFork.Api({
        storage            : node.store,
        debugMode          : false,
        onBatchJobStart    : function() { },
        onBatchJobComplete : function() { }
    });
    
    node.endpoint = new GroundFork.BasicHttpEndpoint({
        api                : node.api,
        url                : node.config.url,
        clientKey          : node.config.key,
        clientSecret       : node.config.secret,
        requestHandler     : GroundFork.BasicHttpEndpoint.nodeRequestHandler,
        onRequestStart     : function() { },
        onRequestComplete  : function() { }
    });

    return node;
};

var rootNode = buildNode('root', 'root');
var test1    = buildNode('test-user1', 'test');
var test2    = buildNode('test-user2', 'test');
var test3    = buildNode('test-user3', 'test');

function assert(label, predicate, message) {
    if (true !== predicate) {
        console.log('Test ' + label + ' failed: ' + message);
    } else {
        console.log('Test ' + label + ' passed.');
    }
}

module.exports = {
    rootNode  : rootNode,
    testUser1 : test1,
    testUser2 : test2,
    testUser3 : test3,
    assert    : assert
};
