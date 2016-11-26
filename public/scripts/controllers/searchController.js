app.controller('searchController', ['$scope', '$http', function($scope, $http){
  console.log('Search Controller');

  $scope.searchFunction = function () {
    console.log('in searchFunction');

    if(isNaN($scope.search) === true) {
      console.log('search is NOT a number');
      $http({
        method: 'GET',
        url: '/search/client_name?q=' + $scope.search,
      }).then(function (response){
            console.log('client_name search success', response);
            $scope.search = null;
          }, function (error) {
            console.log('client_name search error:', error);
          }); // end then function
    } else {
      console.log('search IS a number');
      $http({
        method: 'GET',
        url: '/search/cart_number?q=' + $scope.search,
      }).then(function (response){
            console.log('cart_number search success:', response);
            $scope.search = null;
          }, function (error) {
            console.log('cart_number search error:', error);
          }); // end then function
    } // end else
  }; // end searchFunction

}]); // end searchController
