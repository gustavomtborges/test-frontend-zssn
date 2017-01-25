(function () {
  'use strict';

  angular.module('app').controller('SurvivorsController', SurvivorsController);

  SurvivorsController.$inject = ['survivorService', '$timeout', '$q', '$scope'];

  function SurvivorsController(survivorService, $timeout, $q) {
    var controller = this;
    var beginOffset = 0;
    var endOffset = 20;

    // controller atributes
    controller.survivors = [];
    controller.pages = [];
    controller.currentPage = 0;
    controller.searchString = '';

    // controller functions
    controller.changePage = changePage;
    controller.filterSurvivorsList = filterSurvivorsList;
    controller.previousPage = previousPage;
    controller.nextPage = nextPage;

    // api call to fetch survivors
    survivorService.fetch()
      .then(fetchSurvivorsSucsess)
      .then(drawMap)
      .catch(fetchSurvivorsError);


    // success on fetch survivors
    function fetchSurvivorsSucsess(response) {
      response.data.map(function (value) {
        value.infected = value['infected?'];
      });
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
      if (survivorsLength < 20) {
        controller.pages.push({ number: 1 });
      } else {
        for (; survivorsLength > i; ++i) {
          controller.pages.push({ number: i + 1 });
        }
      }
    }

    // draw google maps
    function drawMap(array) {
      $timeout(function () {
        var i = 0;
        var length = array.length;
        for (; length > i; ++i) {
          if (array[i].lonlat) {
            var latlng = array[i].lonlat.split(' ');
            var lat = Number(latlng[1].split('(')[1]);
            var lng = Number(latlng[2].split(')')[0]);

            // set map
            var map = new google.maps.Map(document.getElementById(array[i].location), {
              center: { lat: lat, lng: lng },
              scrollwheel: false,
              zoom: 10
            });

            // set latlng
            var myLatlng = new google.maps.LatLng(lat, lng);

            // set marker
            var marker = new google.maps.Marker({              
              position: myLatlng,
              title: 'I\'m here!'
            });
            marker.setMap(map);
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

    // go to previous page
    function previousPage() {
      controller.currentPage = controller.currentPage - 1;
      changePage(controller.currentPage);
    }

    // go to next page
    function nextPage() {
      controller.currentPage = controller.currentPage + 1;
      changePage(controller.currentPage);
    }

    // filter survivors list based on search
    function filterSurvivorsList() {
      var newListSurvivors = controller.survivors.map(function (value) {
        if (value.name.match(controller.searchString)) {
          return value;
        }
      });
      newListSurvivors = newListSurvivors.filter(Boolean);
      controller.currentPage = 0;
      controller.filteredSurvivors = newListSurvivors.slice(0, 20);
      controller.pages = [];
      calculatePageNumbers(newListSurvivors.length);
      drawMap(controller.filteredSurvivors);
    }
  }
})();