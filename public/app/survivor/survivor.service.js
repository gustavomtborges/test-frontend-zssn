(function () {
  'use strict';

  angular.module('app').service('survivorService', SurvivorService);

  SurvivorService.$inject = ['$http', 'ZSSN_API'];

  function SurvivorService($http, ZSSN_API) {
    var service = this;

    service.fetch = fetch;
    service.create = create;

    /**
     * fetch all survivors
     * 
     */
    function fetch() {
      return $http.get(ZSSN_API + '/people.json');
    }

    /**
     * create a survivor
     * 
     */
    function create(survivor) {
      return $http({
        method: 'POST',
        url: ZSSN_API + '/people.json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          return str.join('&');
        },
        data: {
          'person[name]': survivor.name,
          'person[age]': survivor.age,
          'person[gender]': survivor.gender,
          'person[lonlat]': survivor.lonlat,
          items: survivor.items
        }
      });
    }
  }
})();