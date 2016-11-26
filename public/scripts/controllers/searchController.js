app.controller('searchController', ['$scope', function($scope){
  console.log('Search Controller');

  $scope.searchFunction = function () {
    console.log('in searchFunction');
    console.log(typeof(isNaN($scope.search)));
    if(isNaN($scope.search) === true) {
      console.log('search is NOT a number');
      $http({
        method: 'GET',
        url: '/production/production?q=' + $scope.currentProdId,
      }).then(function (response){
            console.log('success in prodCtrl post route:', response);
            $scope.productionSaved = true;
            $scope.clearFields();
          }, function (error) {
            console.log('error in prodCtrl post route:', error);
          }); // end then function
    }; // end http call
      clearFields();
    } else {
      console.log('log IS a number');
      clearFields();
    }
  }; // end searchFunction

var clearFields = function () {
  $scope.search = null;
};

}]); // end searchController
