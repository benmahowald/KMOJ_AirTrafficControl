app.controller('reportController', ['$scope', '$http', function($scope, $http){
  console.log('Report Controller');

  $scope.reports = [];

  $scope.getReports = function (){
    $http({
      method: 'GET',
      url: '/reports/reports'
    }).then(function(response){
      $scope.reports = response.data;
      console.log ($scope.reports);
    }, function errorCallback(response){
      console.log('error getting reports', response);
    });
  };

}]);
