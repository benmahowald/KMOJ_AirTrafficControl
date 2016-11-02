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

// $scope.downloadReportPdf = function(){
//     console.log("In the PDF click");
//     var docDefinition =
//       {content: [
//
//         {text: "Date: " + $scope.date.toString().substring(0,15) },
//         {text: "Injuries: " + $scope.injuries },
//         {text: "Complaints: " + $scope.complaints },
//         {text: "Surgeries: " + $scope.surgeries },
//         {text: "Average Ride Length: " + $scope.averageRideLength },
//         {text: "Upcoming Races: " + $scope.upcomingRaces },
//         {text: "Current Bike Brand: " + $scope.currentBikeBrand },
//         {text: "Saddle Height: " + $scope.saddleHeight },
//         {text: "Saddle Height Over Bars: " + $scope.saddleHeightOverBars },
//         {text: "Saddle Angle: " + $scope.saddleAngle},
//         {text: "Saddle Setback: " + $scope.saddleSetback },
//         {text: "Saddle Handlebar Reach: " +  $scope.SaddlehandlebarReach},
//         {text: "Stem Length: " + $scope.stemLength },
//         {text: "Stem Angle: " + $scope.stemAngle },
//         {text: "Handlebar Width: " + $scope.handlebarWidth },
//         {text: "Handlebar Brand: " + $scope.handlebarBrand },
//         {text: "Pedal Brand/Model: " + $scope.pedalBrandModel },
//         {text: "Shoe Brand: " + $scope.shoeBrand },
//         {text: "Brake Level: " + $scope.brakeLevel },
//         {text: "Crank Length: " + $scope.crankLength },
//         {text: "Notes: " + $scope.notes }
//       ]// end content
//     };// end docDefinition
//     pdfMake.createPdf(docDefinition).download('existingFit.pdf');
//   }; // end downloadFormOnePdf
