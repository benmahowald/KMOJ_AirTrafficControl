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

  $scope.clearSearch = function () {
    console.log('in clearSearch');
    $scope.results = null;
  };

}]); // end searchController
