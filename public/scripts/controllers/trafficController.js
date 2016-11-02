app.controller('trafficController', ['$scope','$http', function($scope, $http){
  console.log('Traffic Controller');
  $scope.sendTraffic = function (){
    var traffictoSend = {
      interviews: $scope.interviews,
      socialmedia: $scope.socialmedia,
      man_app: $scope.man_app,
      uw_app: $scope.uw_app,
      pr_app: $scope.pr_app,
      tr_app: $scope.pr_app
    };
    $http({
      method: 'POST',
      url: '/traffic/media',
      data: traffictoSend
    }).then(function(response){
      console.log('traffic to send id', response);
    }, function errorCallback (response){
      console.log('err', response);
    });
};
}]);
