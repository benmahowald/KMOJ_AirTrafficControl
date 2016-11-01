app.controller('reportController', ['$scope', function($scope){
  console.log('Report Controller');

  $scope.reports = [];

  $scope.getReports = function (){
    $http({
      method: 'GET',
      url: '/reports/reports'
    }).then(function(response){
      $scope.reports = response.data;
    }, function errorCallback(response){
      console.log('error getting reports', response);
    }
  });

}]);
