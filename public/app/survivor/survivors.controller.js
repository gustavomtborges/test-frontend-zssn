(function () {
  'use strict';

  angular.module('app').controller('SurvivorsController', SurvivorsController);

  SurvivorsController.$inject = ['survivorService', '$timeout', '$q'];

  function SurvivorsController(survivorService, $timeout, $q) {
    var controller = this;
    var beginOffset = 0;
    var endOffset = 20;

    // controller atributes        
    controller.survivors = [];
    controller.pages = [];
    controller.currentPage = 0;

    // controller functions
    controller.changePage = changePage;

    // api call to fetch survivors
    survivorService.fetch()
      .then(fetchSurvivorsSucsess)
      .then(drawMap)
      .catch(fetchSurvivorsError);


    // success on fetch survivors
    function fetchSurvivorsSucsess(response) {
      controller.survivors = response.data.reverse();
      controller.filteredSurvivors = controller.survivors.slice(beginOffset, endOffset);
      calculatePageNumbers(response.data.length);

      var deferred = $q.defer();
      deferred.resolve(controller.filteredSurvivors);

      return deferred.promise;
    }

    // error on fetch survivors
    function fetchSurvivorsError(error) {
      alert('A error occourred on fetch survivors');
      console.log(error);
    }


    // calc page numbers
    function calculatePageNumbers(length) {
      var i = 0;
      var survivorsLength = (length / 20).toFixed(0);
      for (; survivorsLength > i; ++i) {
        controller.pages.push({ number: i + 1});
      }
    }

    // draw google maps
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

    // change page
    function changePage(pageIndex) {      
      beginOffset = (pageIndex * 20);
      endOffset = (pageIndex * 20) + 20;
      controller.currentPage = pageIndex;
      controller.filteredSurvivors = controller.survivors.slice(beginOffset, endOffset);
      drawMap(controller.filteredSurvivors);
    }
  }

})();