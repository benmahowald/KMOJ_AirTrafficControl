app.controller('searchController', ['$scope', function($scope){
  console.log('Search Controller');

  $scope.searchFunction = function () {
    console.log('in searchFunction');
    console.log(typeof(isNaN($scope.search)));
    if(isNaN($scope.search) === true) {
      console.log('search is NaN');
    } else {
      console.log('log IS a number');
    }
  }; // end searchFunction

}]); // end searchController
