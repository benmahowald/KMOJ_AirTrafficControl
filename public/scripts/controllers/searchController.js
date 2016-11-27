app.controller('searchController', ['$scope', '$http', function($scope, $http){
  console.log('In Search Controller');

  $scope.searchFunction = function (query) {
    // console.log('in searchFunction');
    $scope.query = query;
    // console.log('query is:', query);
    if(isNaN(query) === true) {
      // console.log('search is NOT a number');
      $http({
        method: 'GET',
        url: '/search/client_name?q=' + query,
      }).then(function (response){
            console.log('client_name search success', response);
            $scope.results = response.data;
            $scope.search = null;
          }, function (error) {
            console.log('client_name search error:', error);
          }); // end then function
    } else {
      // console.log('search IS a number');
      $http({
        method: 'GET',
        url: '/search/cart_number?q=' + $scope.search,
      }).then(function (response){
            // console.log('cart_number search success:', response);
            $scope.results = response.data;
            $scope.search = null;
          }, function (error) {
            console.log('cart_number search error:', error);
          }); // end then function
    } // end else
  }; // end searchFunction

}]); // end searchController

// (function () {
//   'use strict';
//       // .module('autocompleteDemo', ['ngMaterial'])
//       app.controller('searchController', searchController);
//
//   function searchController ($timeout, $q, $log) {
//     console.log('in search controller');
//     var self = this;
//
//     self.simulateQuery = false;
//     self.isDisabled    = false;
//
//     // list of `state` value/display objects
//     self.states        = loadAll();
//     self.querySearch   = querySearch;
//     self.selectedItemChange = selectedItemChange;
//     self.searchTextChange   = searchTextChange;
//
//     // ******************************
//     // Internal methods
//     // ******************************
//
//     /**
//      * Search for states... use $timeout to simulate
//      * remote dataservice call.
//      */
//     function querySearch (query) {
//       var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
//           deferred;
//       if (self.simulateQuery) {
//         deferred = $q.defer();
//         $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
//         return deferred.promise;
//       } else {
//         return results;
//       }
//     }
//
//     function searchTextChange(text) {
//       $log.info('Text changed to ' + text);
//     }
//
//     function selectedItemChange(item) {
//       $log.info('Item changed to ' + JSON.stringify(item));
//     }
//
//     /**
//      * Build `states` list of key/value pairs
//      */
//     function loadAll() {
//       var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
//               Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
//               Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
//               Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
//               North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
//               South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
//               Wisconsin, Wyoming';
//
//       return allStates.split(/, +/g).map( function (state) {
//         return {
//           value: state.toLowerCase(),
//           display: state
//         };
//       });
//     }
//
//     /**
//      * Create filter function for a query string
//      */
//     function createFilterFor(query) {
//       var lowercaseQuery = angular.lowercase(query);
//
//       return function filterFn(state) {
//         return (state.value.indexOf(lowercaseQuery) === 0);
//       };
//
//     }
//   }
// })();
