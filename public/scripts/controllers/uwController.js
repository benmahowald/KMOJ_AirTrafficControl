app.controller('uwController', ['$scope', function($scope){
  console.log('Underwriter Controller');
  //// code for the traffic entry grid
  // Initialize variables
  // weeks will hold the actual scheduling information
  $scope.weeks = {week1:{num: 1}};
  $scope.totals = {week1:{total: 0}};
  $scope.currentNumWeeks = 1;
  // This object is used as a scaffold help build the grid
  $scope.hours = {
    am2: {text:'2am-5am', title:'am2'},
    am5: {text:'5am-6am', title:'am5'},
    am6: {text:'6am-10am', title:'am6'},
    am10: {text:'10am-2pm', title:'am10'},
    pm2: {text:'2pm-6pm', title:'pm2'},
    pm6: {text:'6pm-7pm', title:'pm6'},
    pm7: {text:'7pm-10pm', title:'pm7'},
    pm10: {text:'10pm-2am', title:'pm10'}
  };
  // This is used to populate the header and scaffold the grid
  $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  console.log($scope.hours);

  $scope.showObject = function(){
    console.log($scope.weeks);
  };

  $scope.updateWeeks = function(weekRequest){
    console.log('in updateWeeks with:', weekRequest);
    var currentMaxWeek = $scope.currentNumWeeks;
    console.log('currentMaxWeek:', currentMaxWeek);
    var weeksToAdd = weekRequest - currentMaxWeek;
    console.log('weeksToAdd:', weeksToAdd);
    if (weeksToAdd > 0){
      var nextWeekNum = currentMaxWeek+1;
      var newTotalWeeks = currentMaxWeek+weeksToAdd;
      for (var i = nextWeekNum; i <= newTotalWeeks; i++) {
        $scope.weeks['week'+i]={num: i};
        $scope.totals['week'+i]={total: 0};
        $scope.currentNumWeeks++;
      }
    }
  };

  $scope.updateTotals = function(thisWeek, thisHour, thisDay){
    console.log('in updateTotals, with:', thisDay, thisHour, thisWeek);
    var weekName = 'week'+thisWeek;
    // Reset counters
    $scope.totals[weekName][thisHour] = 0;
    $scope.totals[weekName].total = 0;
    $scope.flightTotal = 0;
    var dayCheck;
    // check to see if anything has been recorded yet
    for (var i = 0; i < $scope.days.length; i++) {
      dayCheck = $scope.days[i];
      //// Update the hour's total
      // if there is a total for that day then add it to the sum
      if ($scope.weeks[weekName][thisHour][dayCheck]) {
        $scope.totals[weekName][thisHour] =
          $scope.totals[weekName][thisHour] +
          $scope.weeks[weekName][thisHour][dayCheck];
      }
      //// Update the week's total
      for (var hour in $scope.hours) {
        if ($scope.hours.hasOwnProperty(hour)) {
          if ($scope.weeks[weekName][hour] && $scope.weeks[weekName][hour][dayCheck]) {
            $scope.totals[weekName].total =
              $scope.totals[weekName].total +
              $scope.weeks[weekName][hour][dayCheck];
          }
        }
      }  // End for loop throuh hours in day
    } // End for loop through days of week

    //// Update the flight's total
    console.log($scope.currentNumWeeks);
    for (var j = 1; j <= $scope.currentNumWeeks; j++) {
        $scope.flightTotal = $scope.flightTotal + $scope.totals['week'+j].total;
        console.log('flightTotal:', $scope.flightTotal);
    }
    console.log('totals:',$scope.totals);
  }; // end updateTotals

  $scope.incrementCount = function(thisWeek, thisHour, thisDay) {
    console.log('in incrementCount, with:', thisDay, thisHour, thisWeek);
    var weekName = 'week'+thisWeek;
    if (!$scope.weeks[weekName][thisHour]){
      $scope.weeks[weekName][thisHour] = {};
    }
    if ($scope.weeks[weekName][thisHour][thisDay]){
      $scope.weeks[weekName][thisHour][thisDay]++;
    } else {
      $scope.weeks[weekName][thisHour][thisDay] = 1;
    }
    $scope.updateTotals(thisWeek, thisHour, thisDay);
  };


  $scope.submitRunSheetEntry = function (){
    console.log('in submitRunSheetEntry');
    var objectToSend = {
      event_name: $scope.event_name,
      client: $scope.client,
      client_contact: $scope.clientContact,
      phone: $scope.phone,
      cell: $scope.cell,
      fax: $scope.fax,
      email: $scope.email,
      website: $scope.website,
      street: $scope.street,
      city: $scope.city,
      zip: $scope.zip,
      start_date: $scope.startDate,
      end_date: $scope.endDate,
      fa: $scope.fa,
      psa: $scope.psa,
      instructions: $scope.instructions,
      discount: $scope.discount,
      agency_comission: $scope.agency_comission
    };
    console.log('UW objectToSend:', objectToSend);

    $http({
      method: 'POST',
      url: '/',
      data: objectToSend,
    }).then(function (response){
          console.log('success in uwCtrl post route:', response);
        }, function (error) {
          console.log('error in uwCtrl post route:', error);
        }); // end then function
  }; // end submitRunSheetEntry

  // $scope.submitEventInfo = function () {
  //   console.log('in submitEventInfo');
  // }; //end submitEventInfo
  //
  // $scope.submitContactInfo = function () {
  //   console.log('in submitContactInfo');
  // }; //end submitContactInfo
  //
  // $scope.submitAddressInfo = function () {
  //   console.log('in submitAddressInfo');
  // }; //end submitAddressInfo
  //
  // $scope.submitFlightInfo = function () {
  //   console.log('in submitFlightInfo');
  // }; //end submitFlightInfo
}]); // end uwController
