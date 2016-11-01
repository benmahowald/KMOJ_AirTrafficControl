app.controller('uwController', ['$scope', function($scope){
  console.log('Underwriter Controller');
  //// code for the traffic entry grid
  // Initialize variables
  // weeks will hold the actual scheduling information
  $scope.weeks = {week1:{handle: 'week'+1}};
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
        $scope.weeks['week'+i]={handle: 'week'+i};
        $scope.totals['week'+i]={total: 0};
        $scope.currentNumWeeks++;
      }
    }
  };

  $scope.updateTotals = function(thisWeek, thisHour, thisDay){
    console.log('in updateTotals, with:', thisDay, thisHour, thisWeek);
    $scope.totals[thisWeek][thisHour] = 0;
    $scope.totals[thisWeek].total = 0;
    var dayCheck;
    // check to see if anything has been recorded yet
    for (var i = 0; i < $scope.days.length; i++) {
      dayCheck = $scope.days[i];
      // if there is a total for that day then add it to the sum
      if ($scope.weeks[thisWeek][thisHour][dayCheck]) {
        $scope.totals[thisWeek][thisHour] =
          $scope.totals[thisWeek][thisHour] +
          $scope.weeks[thisWeek][thisHour][dayCheck];
      }
      for (var hour in $scope.hours) {
        if ($scope.hours.hasOwnProperty(hour)) {
          console.log('hour is:', hour);
          console.log('dayCheck is:', dayCheck);
          console.log('$scope.totals[\'week\'+thisWeek]:',$scope.totals[thisWeek]);
          if ($scope.weeks[thisWeek][hour] && $scope.weeks[thisWeek][hour][dayCheck]) {
            console.log('total before is:', $scope.totals[thisWeek].total);
            $scope.totals[thisWeek].total =
              $scope.totals[thisWeek].total +
              $scope.weeks[thisWeek][hour][dayCheck];
            console.log('adding:', $scope.weeks[thisWeek][hour][dayCheck]);
            console.log('result:', $scope.totals[thisWeek].total);
          }
        }
      }
    }


    console.log('totals:',$scope.totals);
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
