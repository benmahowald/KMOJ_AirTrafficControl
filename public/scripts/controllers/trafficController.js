app.controller('trafficController', ['$scope','$http', function($scope, $http){
  console.log('Traffic Controller');

  $scope.getPendingContracts = function () {
    console.log('in getPendingContracts');
    $http({
      method: 'GET',
      url: '/traffic/contractsPending',
    }).then(function(response){
      $scope.pendingContracts = response.data;
      $scope.flightInfoExists = false;
      console.log('$scope.pendingContracts', $scope.pendingContracts);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end getPendingContracts

  $scope.getPendingContracts();

  $scope.selectContractFlight = function (contract_id) {
    console.log('in selectContractFlight');
    console.log('contract_id = ' + contract_id);
    $scope.currentContractId = contract_id;
    $http({
      method: 'GET',
      url: '/traffic/flightContract?q=' + contract_id,
    }).then(function(response){
      $scope.flightInfo = response.data;
      $scope.start_date = moment($scope.flightInfo[0].start_date).format('ddd, MMM DD YYYY');
      $scope.end_date = moment($scope.flightInfo[0].end_date).format('ddd, MMM DD YYYY');
      $scope.flightInfoExists = true;
      $scope.getCartNum();
      // console.log(response);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end selectContract

  $scope.trafficApproval = function (contract_id) {
    console.log('in trafficApproval');
    console.log('contract_id = ', contract_id);
    $http({
      method: 'PUT',
      url: '/traffic/approval?q=' + contract_id,
    }).then($scope.getPendingContracts);
  }; // end trafficApproval

  $scope.getCartNum = function () {
    console.log('in getCartNum');
    $http({
      method: 'GET',
      // whatever url Luis uses
      url: '/traffic/cart_number?q=' + $scope.currentContractId,
    }).then(function (response){
          $scope.cart_number = response.data[0].cart_number;
          console.log('$scope.cart_number = ', $scope.cart_number);
        }, function (error) {
          console.log('error in cart_number get;', error);
        }); // end then function
    }; // end getCartNum

    $scope.updateCartNum = function (cart_number) {
      console.log('in updateCartNum');
      console.log('cart_number', cart_number);
    $http({
      method: 'PUT',
      url: '/traffic/cart_number?q=' + $scope.currentContractId,
      data: cart_number
    }).then($scope.getCartNum);
  }; // end updateCartNum

}]); // end trafficController
