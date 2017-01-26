(function () {
  'use strict';

  angular.module('app').service('reportService', ReportService);

  ReportService.$inject = ['$http', 'ZSSN_API'];

  function ReportService($http, ZSSN_API) {
    var service = this;

    service.infected = infected;
    service.pointsLost = pointsLost;
    service.averageItems = averageItems;

    /**
     * get infected survivors percentage
     * 
     */
    function infected() {
      return $http.get(ZSSN_API + '/report/infected.json');
    }

    /**
     * get points lost becouse infected survivors
     * 
     */
    function pointsLost() {
      return $http.get(ZSSN_API + '/report/infected_points.json');
    }

    /**
     * get average items per survivor
     * 
     */
    function averageItems() {
      return $http.get(ZSSN_API + '/report/people_inventory.json');
    }
  }
})();