// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])
var localDB = new PouchDB("tarifador");
var remoteDB = new PouchDB("http://alcancearoa:5984/tarifador");

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    localDB.sync(remoteDB, {live: true});
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/search/',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
        //controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
// Code to signal every time we’ve received some kind of data change.
example.factory('PouchDBListener', ['$rootScope', function($rootScope) {

    localDB.changes({
        continuous: true,
        onChange: function(change) {
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    localDB.get(change.id, function(err, doc) {
                        $rootScope.$apply(function() {
                            if (err) console.log(err);
                            $rootScope.$broadcast('add', doc);
                        })
                    });
                })
            } else {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('delete', change.id);
                });
            }
        }
    });

    return true;

}]);
// example controller
example.controller("ExampleController", function($scope, $ionicPopup, PouchDBListener) {

    $scope.tarifador = [];

    $scope.create = function() {
        $ionicPopup.prompt({
            title: 'Enter a new TODO item',
            inputType: 'text'
        })
        .then(function(result) {
            if(result !== "") {
                if($scope.hasOwnProperty("tarifador") !== true) {
                    $scope.tarifador = [];
                }
                localDB.post({title: result});
            } else {
                console.log("Action not completed");
            }
        });
    }

    $scope.$on('add', function(event, todo) {
        $scope.tarifador.push(todo);
    });

    $scope.$on('delete', function(event, id) {
        for(var i = 0; i < $scope.tarifador.length; i++) {
            if($scope.tarifador[i]._id === id) {
                $scope.tarifador.splice(i, 1);
            }
        }
    });

});
