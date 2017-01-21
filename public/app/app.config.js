(function () {
  'use strict';

  angular.module('app').config(configBlock);

  configBlock.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
  
  function configBlock($stateProvider, $urlRouterProvider, $locationProvider) {
    var menuState = {
      abstract: true,
      templateUrl: 'app/template/menu.html'
    };

    var homeState = {
      url: '/',
      views: {
        'menuContent': {
          templateUrl: 'app/home/home.html'
        }
      }      
    };

    var survivorState = {
      url: '/survivors',
      views: {
        'menuContent': {
          templateUrl: 'app/survivor/survivors.html',
          controller: 'SurvivorController',
          controllerAs: 'survivorCtrl'
        }
      }
    };

    $stateProvider.state('menu', menuState);
    $stateProvider.state('menu.home', homeState);
    $stateProvider.state('menu.survivor', survivorState);

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
})();