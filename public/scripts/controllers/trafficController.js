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
      console.log('traffic contract success', response);
      $scope.flightInfo = response.data;
      console.log('$scope.flightInfo = ', $scope.flightInfo);
      console.log('$scope.flightInfo.end_date = ', $scope.flightInfo[0].end_date);

      $scope.start_date = moment($scope.flightInfo[0].start_date).format('ddd, MMM DD YYYY');
      $scope.end_date = moment($scope.flightInfo[0].end_date).format('ddd, MMM DD YYYY');
      $scope.flightInfoExists = true;
      console.log(response);
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

  $scope.getInvoice = function () {
    console.log('in getInvoice');
  }; // end getInvoice

  // $scope.sendTraffic = function (){
  //   var traffictoSend = {
  //     interviews: $scope.interviews,
  //     socialmedia: $scope.socialmedia,
  //     man_app: $scope.man_app,
  //     uw_app: $scope.uw_app,
  //     pr_app: $scope.pr_app,
  //     tr_app: $scope.pr_app
  //   }; // end sendTraffic object
  //
  //   $http({
  //     method: 'POST',
  //     url: '/traffic/media',
  //     data: traffictoSend
  //   }).then(function(response){
  //     console.log('traffic to send id', response);
  //   }, function errorCallback (response){
  //     console.log('err', response);
  //   }); // end then
  // }; // end send traffic
}]); // end trafficController
