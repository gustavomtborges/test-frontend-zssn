(function () {
  'use strict';

  angular.module('app').controller('ReportsController', ReportsController);

  ReportsController.$inject = ['reportService', 'survivorService', '$q', '$timeout'];

  function ReportsController(reportService, survivorService, $q, $timeout) {
    var controller = this;

    // controller atributes
    controller.pointsLost = null;
    controller.doneItemsChart = false;
    controller.ammo = 0;
    controller.food = 0;
    controller.medic = 0;
    controller.water = 0;

    // load tabs
    $('ul.tabs').tabs();

    // load google charts
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(getInfectedReport);
    google.charts.setOnLoadCallback(getAverageItemsByKind);

    // get points lost because infected
    getPointsLostFromInfectedSurvivors();

    /**
     * get infected report
     * 
     */
    function getInfectedReport() {
      reportService.infected()
        .then(getInfectedReportSuccess)
        .catch(function (error) {
          Materialize.toast('Error on get infected report!', 3000);
          console.log(error);
        });
    }

    /**
     * success on get infected report
     * 
     */
    function getInfectedReportSuccess(response) {
      drawInfectedPieChart(response);
    }

    /**
     * draw infected pie chart
     * 
     */
    function drawInfectedPieChart(response) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      data.addRows([
        ['Infected', response.data.report.average_infected],
        ['Non-Infected', 1 - response.data.report.average_infected],
      ]);

      // Set chart options
      var options = {
        width: 900,
        height: 500,
        backgroundColor: '#fcfcfc',
        colors: ['#db0000', '#182aaf'],
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_infected'));
      chart.draw(data, options);
    }


    /**
     * get points lost from infected survivors
     * 
     */
    function getPointsLostFromInfectedSurvivors() {
      reportService.pointsLost()
        .then(function (response) {
          controller.pointsLost = response.data.report.total_points_lost;
        })
        .catch(function (error) {
          Materialize.toast('Error on get lost points!', 3000);
          console.log(error);
        });
    }

    /**
     * get average items by kind
     * 
     */
    function getAverageItemsByKind() {
      if (window.sessionStorage.getItem('totalSurvivors')) {
        var items = {
          water: window.sessionStorage.getItem('water'),
          food: window.sessionStorage.getItem('food'),
          medic: window.sessionStorage.getItem('medic'),
          ammo: window.sessionStorage.getItem('ammo'),
          totalSurvivors: window.sessionStorage.getItem('totalSurvivors'),
        };
        drawAverageItemsPieChart(items);
      } else {
        fetchAllSurvivors()
          .then(calculateItemsPerKind)
          .then(drawAverageItemsPieChart)
          .catch(function (error) {
            Materialize.toast('Error on get average items by kind!', 3000);
            console.log(error);
          });
      }
    }

    /**
     * draw average items pie chart
     * 
     */
    function drawAverageItemsPieChart(items) {
      controller.doneItemsChart = true;

      var data = google.visualization.arrayToDataTable([
        ['Task', 'Item kind per survivor'],
        ['Water', items.water / items.totalSurvivors],
        ['Food', items.food / items.totalSurvivors],
        ['Ammunition', items.ammo / items.totalSurvivors],
        ['Medication', items.medic / items.totalSurvivors]
      ]);      

      // Set chart options
      var options = {
        width: 900,
        height: 500,
        backgroundColor: '#fcfcfc',
        colors: ['#182aaf', '#cebf35', '#db0000', '#3ace35']
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_averageItems'));
      chart.draw(data, options);
    }

    /**
     * calculate number of items per kind
     * 
     */
    function calculateItemsPerKind(survivorIds) {
      var deferred = $q.defer();

      survivorIds.map(function (survivorId) {
        survivorService.fetchItems(survivorId)
          .then(fetchItemsSuccess);
      });

      $timeout(function () {
        window.sessionStorage.setItem('water', controller.water);
        window.sessionStorage.setItem('food', controller.food);
        window.sessionStorage.setItem('medic', controller.medic);
        window.sessionStorage.setItem('ammo', controller.ammo);
        window.sessionStorage.setItem('totalSurvivors', controller.totalSurvivors);

        var items = {
          water: controller.water,
          food: controller.food,
          medic: controller.medic,
          ammo: controller.ammo,
          totalSurvivors: controller.totalSurvivors,
        };

        deferred.resolve(items);
      }, 32 * 1000);

      return deferred.promise;
    }

    /**
     * success on fetch items
     * 
     */
    function fetchItemsSuccess(response) {
      if (response.data.length) {
        response.data.map(function (value) {
          if (value.item.name === 'Ammunition') {
            controller.ammo += value.quantity;
          }
          if (value.item.name === 'Water') {
            controller.water += value.quantity;
          }
          if (value.item.name === 'Food') {
            controller.food += value.quantity;
          }
          if (value.item.name === 'Medication') {
            controller.medic += value.quantity;
          }
        });
      }
    }


    /**
     * fetch all survivors
     * 
     */
    function fetchAllSurvivors() {
      var deferred = $q.defer();

      survivorService.fetch()
        .then(fetchAllSurvivorsSuccess)
        .then(function (survivorIds) {
          deferred.resolve(survivorIds);
        });

      return deferred.promise;
    }

    /**
     * success on fetch all survivors
     * 
     */
    function fetchAllSurvivorsSuccess(response) {
      var deferred = $q.defer();
      var survivorIds = response.data.map(function (value) {
        return value.location.split('/')[5];
      });
      controller.totalSurvivors = survivorIds.length;
      deferred.resolve(survivorIds);

      return deferred.promise;
    }

  }
})();