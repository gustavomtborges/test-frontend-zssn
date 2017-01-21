(function () {
  'use strict';

  angular.module('app').service('survivorService', SurvivorService);

  SurvivorService.$inject = ['$http', 'ZSSN_API'];

  function SurvivorService($http, ZSSN_API) {
    var service = this;

    service.fetch = fetch;

    function fetch() {
      return $http.get(ZSSN_API + '/people.json');
    }
  }
})();