(function () {
  'use strict';

  angular.module('app').controller('CreateSurvivorController', CreateSurvivorController);

  CreateSurvivorController.$inject = ['survivorService', '$scope'];

  function CreateSurvivorController(survivorService, $scope) {
    var controller = this;

    // local vars
    var map;
    var marker;

    // inputs
    controller.data = {
      gender: 'M'
    };

    // functions
    controller.submitForm = submitForm;

    // call geolocation api and try to get current location
    getCurrentLocation();

    /**
     * submit form
     * 
     */
    function submitForm() {
      formatItensString(controller.data.water, controller.data.food, controller.data.medication, controller.data.ammunition);

      survivorService.create(controller.data)
        .then(createSurvivorSuccess)
        .catch(createSurvivorError);
    }

    /**
     * success on create survivor
     * 
     */
    function createSurvivorSuccess() {
      Materialize.toast('Survivor added with success!', 3000);
    }

    /**
     * error on create survivor
     * 
     */
    function createSurvivorError(error) {
      Materialize.toast('Error on added survivor!', 3000);
      console.log(error);
    }

    /**
     * get current location
     *      
     */
    function getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(drawMapWithCurrentLoc, getLocationError, {
        enableHighAccuracy: true
      });
    }

    /**
     * draw map with current location
     * 
     */
    function drawMapWithCurrentLoc(loc) {
      controller.data.lonlat = 'POINT (' + loc.coords.latitude + ' ' + loc.coords.longitude + ')';
      var myLatlng = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);

      // map options
      var mapOptions = {
        scrollwheel: false,
        center: { lat: loc.coords.latitude, lng: loc.coords.longitude },
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
      $scope.$apply();
    }

    /**
     * error on get location
     * 
     */
    function getLocationError() {
      alert('we could not get your current location :(');
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

    /**
     * format itens string
     * 
     */
    function formatItensString(water, food, medic, ammo) {
      controller.data.items = 'Water:' + water + ';Food:' + food + ';Medication:' + medic + ';Ammunition' + ammo + ';';
    }

  }
})();