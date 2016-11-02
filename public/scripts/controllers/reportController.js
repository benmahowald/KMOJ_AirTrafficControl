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

  // Copyright (c) 2010-2016 James Hall, https://github.com/MrRio/jsPDF
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  // angular.element(document).ready(function () {
        var doc = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [4, 2]
        });
        doc.
        doc.setFontSize(12);
        doc.text(35, 25, "2123 W. Broadway, Suite 200");
        doc.text(35, 25, "Minneapolis, MN 55411");
        doc.text(35, 25, "Phone: (612)377-0954")
        doc.text(35, 25, "Fax: (612)377-6919")
        var specialElementHandlers = {
          '#editor': function (element, renderer){
          return true;
          }
        };

        $('#cmd').click(function(){
          doc.fromHTML($('#content').html(), 15, 15, {
            'width': 75,
            'elementHandlers': specialElementHandlers
          });
          doc.save('current-report.pdf');
        });



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
