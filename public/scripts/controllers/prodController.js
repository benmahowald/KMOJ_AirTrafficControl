app.controller('prodController', ['$scope', '$http', function($scope, $http){
  console.log('Production Controller');

  $scope.getPendingContracts = function () {
    console.log('in getPendingContracts');
    $http({
      method: 'GET',
      url: '/production/contractsPending',
    }).then(function(response){
      $scope.pendingContracts = response.data;
      // $scope.flightInfoExists = false;
      console.log('$scope.pendingContracts', $scope.pendingContracts);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end getPendingContracts

  $scope.getPendingContracts();

  $scope.selectContractProd = function (contract_id, event_name) {
    console.log('in selectContractProd');
    console.log('contract_id = ' + contract_id);
    // $scope.currentContractId = contract_id;
    $scope.currentEventName = event_name;

    $http({
      method: 'GET',
      url: '/productionInfo?q=' + contract_id,
    }).then(function(response){
      $scope.prodInfo = response.data;
      console.log('prod info:', $scope.prodInfo);
      $scope.flightInfoExists = true;
      // $scope.getCartNum();
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

  $scope.productions = [];

  $scope.getProductions = function (){
    console.log('in getProductions');
    $http({
      method: 'GET',
      url: '/production/productionInfo'
    }).then(function(response){
      $scope.productions = response.data;
      console.log ($scope.productions);
    }, function errorCallback(response){
      console.log('error getting productions', response);
    });
  };

  $scope.retrieveProdId = function(id){
    $scope.currentProdId = id;
    console.log('currentProdId is ', $scope.currentProdId);

  };


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
    console.log('Current Contract Id:', $scope.currentContractId);
    console.log('in updateCartNum', cart_number);
    $http({
      method: 'PUT',
      url: '/traffic/cart_number?q=' + $scope.currentContractId,
      data: cart_number
    }).then($scope.getCartNum);
}; // end updateCartNum



}]); // end production controller
