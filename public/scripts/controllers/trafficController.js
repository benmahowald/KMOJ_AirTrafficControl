app.controller('trafficController', ['$scope','$http', function($scope, $http){
  console.log('Traffic Controller');

  $scope.getPendingContracts = function () {
    console.log('in getPendingContracts');
    $http({
      method: 'GET',
      url: '/traffic/contractsPending',
    }).then(function(response){
      console.log('traffic contract success', response);
      $scope.pendingContracts = response.data;
      console.log(response.data);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end getPendingContracts

  $scope.getPendingContracts();

  $scope.selectContractFlight = function (contract_id) {
    console.log('in selectContractFlight');
    console.log('contract_id = ' + contract_id);
    $http({
      method: 'GET',
      url: '/traffic/flightContract?q=' + contract_id,
    }).then(function(response){
      console.log('traffic contract success', response);
      $scope.flightInfo = response.data;
      console.log(response.data);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end selectContract

  $scope.sendTraffic = function (){
    var traffictoSend = {
      interviews: $scope.interviews,
      socialmedia: $scope.socialmedia,
      man_app: $scope.man_app,
      uw_app: $scope.uw_app,
      pr_app: $scope.pr_app,
      tr_app: $scope.pr_app
    }; // end sendTraffic object

    $http({
      method: 'POST',
      url: '/traffic/media',
      data: traffictoSend
    }).then(function(response){
      console.log('traffic to send id', response);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end send traffic
}]); // end trafficController
