(function () {
  'use strict';

  angular.module('app').controller('UpdateSurvivorController', UpdateSurvivorController);

  UpdateSurvivorController.$inject = ['survivorService', '$scope', '$sessionStorage'];

  function UpdateSurvivorController(survivorService, $scope, $sessionStorage) {
    var controller = this;

    // local vars
    var map;
    var marker;

    // params    
    controller.survivor = $sessionStorage.survivor;

    // inputs
    controller.data = {
      id: controller.survivor.location.split('/')[5],
      name: controller.survivor.name,
      age: controller.survivor.age,
      gender: controller.survivor.gender
    };

    // functions
    controller.submitForm = submitForm;

    // draw map with survivor location
    drawMapWithSurvivorLoc();
  
    /**
     * submit form
     * 
     */
    function submitForm() {      
      survivorService.update(controller.data)
        .then(updateSurvivorSuccess)
        .catch(updateSurvivorError);
    }

    /**
     * success on update survivor
     * 
     */
    function updateSurvivorSuccess() {
      Materialize.toast('Survivor updated with success!', 3000);
    }

    /**
     * error on update survivor
     * 
     */
    function updateSurvivorError(error) {
      Materialize.toast('Error on update survivor!', 3000);
      console.log(error);
    }
  
    /**
     * draw map with survivor location
     * 
     */
    function drawMapWithSurvivorLoc() {
      controller.data.lonlat = 'POINT (' + controller.survivor.lat + ' ' + controller.survivor.lng + ')';
      var myLatlng = new google.maps.LatLng(controller.survivor.lat, controller.survivor.lng);

      // map options
      var mapOptions = {
        scrollwheel: false,
        center: { lat: controller.survivor.lat, lng: controller.survivor.lng },
        zoom: 13
      };

      // set map
      var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

      // set marker
      marker = new google.maps.Marker({
        draggable: true,
        position: myLatlng,
        title: 'I\'m here!'
      });
      marker.setMap(map);
      addMarkerListener(marker);      
    }

    /**
     * listener marker drag event
     * 
     */
    function addMarkerListener(marker) {
      google.maps.event.addListener(marker, 'dragend', function (event) {
        placeMarker(event.latLng, event.latLng.lat(), event.latLng.lng());
      });
    }

    /**
     * set marker new position
     * 
     */
    function placeMarker(loc, lat, lng) {
      controller.data.lonlat = 'POINT (' + lat + ' ' + lng + ')';
      marker = new google.maps.Marker({
        position: loc,
        map: map
      });
      marker.setMap(map);
      $scope.$apply();
    }

  }
})();