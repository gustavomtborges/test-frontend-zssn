(function () {
  'use strict';

  angular.module('app').controller('SurvivorController', SurvivorController);

  SurvivorController.$inject = ['survivorService', '$timeout', '$q'];

  function SurvivorController(survivorService, $timeout, $q) {
    var controller = this;
    var beginOffset = 0;
    var endOffset = 19;

    // controller atributes        
    controller.survivors = [];
    controller.pages = [];
    controller.currentPage = 0;

    // controller functions
    controller.changePage = changePage;


    survivorService.fetch()
      .then(fetchSurvivorsSucsess)
      .then(drawMap)
      .catch(fetchSurvivorsError);

    function fetchSurvivorsSucsess(response) {
      controller.survivors = response.data;
      controller.filteredSurvivors = response.data.slice(beginOffset, endOffset);
      calculateNumberPages(response.data.length);

      var deferred = $q.defer();
      deferred.resolve(controller.filteredSurvivors);

      return deferred.promise;
    }

    function fetchSurvivorsError(error) {
      alert('A error occourred on fetch survivors');
      console.log(error);
    }

    function calculateNumberPages(length) {
      var i = 0;
      var survivorsLength = (length / 20).toFixed(0);
      for (; survivorsLength > i; ++i) {
        controller.pages.push({ number: i + 1 });
      }
    }

    function drawMap(array) {
      $timeout(function () {
        var i = 0;
        var length = array.length;
        for (; length > i; ++i) {
          if (array[i].lonlat) {
            new google.maps.Map(document.getElementById(array[i].location), {
              center: { lat: -34.397, lng: 150.644 },
              scrollwheel: false,
              zoom: 5
            });
          }
        }
      });
    }

    function changePage(pageIndex) {
      event.preventDefault();
      beginOffset = (pageIndex * 20);
      endOffset = (pageIndex * 20) + 19;
      controller.currentPage = pageIndex;
      controller.filteredSurvivors = controller.survivors.slice(beginOffset, endOffset);
      drawMap(controller.filteredSurvivors);
    }
  }
})();