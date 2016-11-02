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

  angular.element(document).ready(function () {
        var doc = new jsPDF();
        var specialElementHandlers = {
          '#editor': function (element, renderer){
          return true;
          }
        };

        $('#cmd').click(function(){
          doc.fromHTML($('#content').html(), 30, 30, {
            'width': 270,
            'elementHandlers': specialElementHandlers
          });
          doc.save('current-report.pdf');
        });
    });


}]);
