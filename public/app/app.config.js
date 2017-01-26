(function () {
  'use strict';

  angular.module('app').config(configBlock);

  configBlock.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
  
  function configBlock($stateProvider, $urlRouterProvider, $locationProvider) {
    var menuState = {
      abstract: true,
      templateUrl: 'public/app/template/menu.html'
    };

    var homeState = {
      url: '/',
      views: {
        'menuContent': {
          templateUrl: 'public/app/home/home.html'
        }
      }      
    };

    var survivorState = {
      url: '/survivors',
      views: {
        'menuContent': {
          templateUrl: 'public/app/survivor/survivors.html',
          controller: 'SurvivorsController',
          controllerAs: 'survivorsCtrl'
        }
      }
    };

    var createSurvivorState = {
      url: '/survivor/create',
      views: {
        'menuContent': {
          templateUrl: 'public/app/survivor/create-survivor.html',
          controller: 'CreateSurvivorController',
          controllerAs: 'createSurvivorCtrl'
        }
      }
    };

    var updateSurvivorState = {
      url: '/survivor/update',      
      views: {
        'menuContent': {
          templateUrl: 'public/app/survivor/update-survivor.html',
          controller: 'UpdateSurvivorController',
          controllerAs: 'updateSurvivorCtrl'
        }
      }
    };

    var reportsState = {
      url: '/reports',
      views: {
        'menuContent': {
          templateUrl: 'public/app/report/reports.html',
          controller: 'ReportsController',
          controllerAs: 'reportsCtrl'
        }
      }
    };

    $stateProvider.state('menu', menuState);
    $stateProvider.state('menu.home', homeState);
    $stateProvider.state('menu.survivors', survivorState);
    $stateProvider.state('menu.createSurvivor', createSurvivorState);
    $stateProvider.state('menu.updateSurvivor', updateSurvivorState);
    $stateProvider.state('menu.reports', reportsState);

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
})();