"use strict";

var request      = require('request');
var Test         = require('./init.js');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');

var rootNode     = Test.rootNode;
var testUser1    = Test.testUser1;
var testUser2    = Test.testUser2;
var testUser3    = Test.testUser3;

// ==================================================================================
 
var ts = Date.now(), response;

/////////////////////////////////////////////////////////////////////////////////////
//
// POST /posts
response = testUser1.api.post('posts', {
    'title'   : 'The first post',
    'body'    : 'In omnium maluisset eum, per putent singulis tincidunt id. Ea mea invidunt posidonium efficiantur, sit tota eius labores ea.',
    'created' : ts
});
//
/////////////////////////////////////////////////////////////////////////////////////

var firstPostId = response.id;

Test.assert(
    '1.1', 
    'success' === response.status, 
    'Expected response status "success", instead got "' + response.status + '"'
);

// Inspect command

Test.assert(
    '1.2', 
    'DELETE' === response.command.down.method, 
    'Expected "DELETE" as response.command.down.method, instead got "' + response.command.down.method + '"'
);

Test.assert(
    '1.3', 
    firstPostId === response.command.down.resource, 
    'Expected id to be "' + firstPostId + '", instead got "' + response.command.down.resource + '"'
);

// ==================================================================================

/////////////////////////////////////////////////////////////////////////////////////
//
// POST /comments
response = testUser1.api.post('comments', 
    {
        'body'    : 'Great story, dude!',
        'created' : ts
    }, 
    { 
        'collection' : firstPostId 
    }
);
//
/////////////////////////////////////////////////////////////////////////////////////

var firstCommentId = response.id;

Test.assert(
    '2.1', 
    'success' === response.status, 
    'Expected response status "success", instead got "' + response.status + '"'
);

var parentPost = testUser1.store.getItem(firstPostId); 

Test.assert(
    '2.2', 
    firstCommentId === parentPost['_links']['comments'][0].href, 
    'Parent post has no link to comment.'
);

// ==================================================================================

/////////////////////////////////////////////////////////////////////////////////////
//
// POST /comments
response = testUser1.api.post('comments', 
    {
        'body'    : 'How about the sandwiches?',
        'created' : ts
    }, 
    { 
        'collection' : firstPostId 
    }
);
//
/////////////////////////////////////////////////////////////////////////////////////

var secondCommentId = response.id;

var parentPost = testUser1.store.getItem(firstPostId); 
var len = parentPost['_links']['comments'].length;

Test.assert(
    '3.1', 
    2 === len, 
    'Expected parent post comments collection length = 2. Instead got ' + len
);

/////////////////////////////////////////////////////////////////////////////////////
//
// DELETE /comments/2
response = testUser1.api.delete(secondCommentId);
//
/////////////////////////////////////////////////////////////////////////////////////

parentPost = testUser1.store.getItem(firstPostId); 
len = parentPost['_links']['comments'].length;

Test.assert(
    '3.2', 
    1 === len, 
    'Expected parent post comments collection length = 1. Instead got ' + len
);

Test.assert(
    '3.3', 
    null === testUser1.store.getItem(secondCommentId), 
    'Expected resource ' + secondCommentId + ' === null.'
);

// ==================================================================================

testUser1.endpoint.sync(['test-user1'], 
function(messages, resp) { 

    var storeKeys = testUser1.store.keys();
    var commentsCollection = testUser1.store.getItem('comments');

    Test.assert(
        '3.4', 
        commentsCollection.count === 1, 
        'Expected comments.count === 1.'
    );

    Test.assert(
        '3.5', 
        commentsCollection['_links']['self']['href'] === 'comments', 
        'Expected comments._links.self.href === "comments".'
    );

    Test.assert(
        '3.6', 
        commentsCollection._links.comments.length === 1, 
        'Expected comments._links.comments.length === 1.'
    );

    Test.assert(
        '3.7', 
        resp.syncPoint === '*', 
        'Expected response.syncPoint === "*".'
    );


        testUser2.endpoint.sync(['test-user1', 'test-user2'], 
        function(messages, resp) { 
        
            Test.assert(
                '5.10', 
                resp.syncPoint === '*', 
                'Expected response.syncPoint === "*".'
            );

        
        }, function(e) { console.log('<error>'); },
        null, function(script) {
        
            Test.assert(
                '5.1', 
                script.length === 4, 
                'Expected sync script length === 4, instead got ' + script.length + '.'
            );
        
            Test.assert(
                '5.2', 
                script[0].method === 'POST', 
                'Expected script[0].metod === "POST".'
            );
        
            Test.assert(
                '5.3', 
                script[0].resource === 'posts', 
                'Expected script[0].resource === "posts".'
            );
        
            Test.assert(
                '5.4', 
                script[1].method === 'POST', 
                'Expected script[1].metod === "POST".'
            );
        
            Test.assert(
                '5.5', 
                script[1].resource === 'comments', 
                'Expected script[1].resource === "comments".'
            );
        
            Test.assert(
                '5.6', 
                script[2].method === 'POST', 
                'Expected script[2].metod === "POST".'
            );
        
            Test.assert(
                '5.7', 
                script[2].resource === 'comments', 
                'Expected script[2].resource === "comments".'
            );
        
            Test.assert(
                '5.8', 
                script[3].method === 'DELETE', 
                'Expected script[3].metod === "DELETE".'
            );
        
            Test.assert(
                '5.9', 
                0 === script[3].resource.indexOf('comments'), 
                'Expected script[3].resource === "comments/*".'
            );


            testUser1.endpoint.sync(['test-user1', 'test-user2'], 
            function(messages, resp) { 

                Test.assert(
                    '7.1', 
                    resp.syncPoint === '*', 
                    'Expected response.syncPoint === "*".'
                );


                // user-1
                response = testUser1.api.post('posts', {
                    'title'   : 'New post from user-1',
                    'body'    : 'In omnium maluisset eum, per putent singulis tincidunt id. Ea mea invidunt posidonium efficiantur, sit tota eius labores ea.',
                    'created' : ts
                });

                // user-2
                response = testUser2.api.post('posts', {
                    'title'   : 'New post from user-2',
                    'body'    : 'In omnium maluisset eum, per putent singulis tincidunt id. Ea mea invidunt posidonium efficiantur, sit tota eius labores ea.',
                    'created' : ts
                });




            
            
            }, function(e) { console.log('<error>'); },
            null, function(script) {

                Test.assert(
                    '6.1', 
                    0 === script.length, 
                    'Expected script.length === 0.'
                );


            });


        
        });


}, 
function(e) { console.log('<error>'); },
null, function(script) {

    Test.assert(
        '4.1', 
        script.length === 8, 
        'Expected sync script length === 8.'
    );

    Test.assert(
        '4.2', 
        script[0].method === 'POST', 
        'Expected script[0].metod === "POST".'
    );

    Test.assert(
        '4.3', 
        script[0].resource === 'comments', 
        'Expected script[0].resource === "comments".'
    );

    Test.assert(
        '4.4', 
        script[1].method === 'DELETE', 
        'Expected script[1].metod === "DELETE".'
    );

    Test.assert(
        '4.5', 
        script[1].resource === 'comments/2', 
        'Expected script[1].resource === "comments/2".'
    );

    Test.assert(
        '4.6', 
        script[2].method === 'DELETE', 
        'Expected script[2].metod === "DELETE".'
    );

    Test.assert(
        '4.7', 
        script[2].resource === 'comments/1', 
        'Expected script[2].resource === "comments/1".'
    );

    Test.assert(
        '4.8', 
        script[3].method === 'DELETE', 
        'Expected script[3].metod === "DELETE".'
    );

    Test.assert(
        '4.9', 
        script[3].resource === 'posts/1', 
        'Expected script[3].resource === "posts/1".'
    );

});

// user-1: POST /posts
// user-1: POST /comments
// user-1: POST /comments
// user-1: DELETE /comments

// ==================================================================================

