app.controller('uwController', ['$scope', '$mdDialog', '$window', function($scope, $mdDialog, $window){
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

  $scope.updateWeeks = function(weekRequest, ev){
    console.log('in updateWeeks with:', weekRequest);

    var currentMaxWeek = $scope.currentNumWeeks;
    // Disallow negative or 0 week requests
    if (weekRequest <= 0) {
      weekRequest = currentMaxWeek;
    }
    console.log('currentMaxWeek:', currentMaxWeek);
    var weeksDiff = weekRequest - currentMaxWeek;
    console.log('weeksDiff:', weeksDiff);
    if (weeksDiff > 0){
      var nextWeekNum = currentMaxWeek+1;
      var newTotalWeeks = currentMaxWeek+weeksDiff;
      var weekToAdd;
      for (var i = nextWeekNum; i <= newTotalWeeks; i++) {
        weekToAdd = 'week'+i;
        $scope.weeks[weekToAdd]={num: i};
        $scope.totals[weekToAdd]={total: 0};
        $scope.currentNumWeeks++;
      } // end for loop
    } else if (weeksDiff < 0) {
      // make weeksDiff positive to be usable in various ways
      weeksDiff = -weeksDiff;
      var newMaxWeek = currentMaxWeek-weeksDiff;
      var emptyOfInfo = true;
      var searchDone = false;
      var removeStart = newMaxWeek+1;
      var weekInQuestion = removeStart;
      var thisWeek;
      // Check to see if any information has been entered in the weeks that are
      // about to be deleted
      while (emptyOfInfo && !searchDone) {
        thisWeek = 'week'+weekInQuestion;
        // check for any hours in the week object
        for (var hour in $scope.weeks[thisWeek]) {
          if ($scope.weeks[thisWeek].hasOwnProperty(hour)) {
            // check for any days in the hour object
            for (var day in $scope.weeks[thisWeek][hour]) {
              if ($scope.weeks[thisWeek][hour].hasOwnProperty(day)) {
                // if the value there is not equal to zero
                if($scope.weeks[thisWeek][hour][day] !== 0) {
                  // then we have info to lose!
                  emptyOfInfo = false;
                } // end zero check
              }
            } // end loop through days
          }
        } // end loop through hours
        weekInQuestion++;
        if (weekInQuestion>currentMaxWeek) {
          searchDone = true;
        }
      }
      // if the weeks in question are not empty of information
      if (!emptyOfInfo) {
        // then confirm the action with the user
        var pluralText = 's';

        if(weeksDiff===1){
          pluralText = '';
        }

        var confirm = $mdDialog.confirm()
        .title('Remove '+weeksDiff+' week'+pluralText+' - Are you sure?')
        .textContent('You have entered information in the '+weeksDiff+' week'+pluralText+' you are about to remove.')
        .ariaLabel('Removal Warning')
        .targetEvent(ev)
        .ok('Remove extra week'+pluralText)
        .cancel('Cancel and review');

        $mdDialog.show(confirm).then(function() {
          console.log('You chose True!');
          $scope.trimWeeks(removeStart, currentMaxWeek, thisWeek, emptyOfInfo);
        }, function() {
          console.log('You chose False!');
        });
      } else {
        // else the week are empty of information and we can remove them
        $scope.trimWeeks(removeStart, currentMaxWeek, thisWeek, emptyOfInfo);
      }
    } // end weeksDiff check (if-else)
  };

  $scope.trimWeeks = function(removeStart, currentMaxWeek, thisWeek, emptyOfInfo){
    for (var j = removeStart; j <= currentMaxWeek; j++) {
      thisWeek = 'week'+j;
      delete $scope.weeks[thisWeek];
      delete $scope.totals[thisWeek];
      $scope.currentNumWeeks--;
    }
    // if it was not empty of info then we need to recalculate the totals
    if (!emptyOfInfo){
      //// Update the flight's total
      $scope.calcFlightTotal();
    }
  };

  $scope.updateTotals = function(thisWeek, thisHour, thisDay){
    console.log('in updateTotals, with:', thisDay, thisHour, thisWeek);
    var weekName = 'week'+thisWeek;
    // Reset counters
    $scope.totals[weekName][thisHour] = 0;
    $scope.totals[weekName].total = 0;
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
    $scope.calcFlightTotal();
  }; // end updateTotals

  $scope.calcFlightTotal = function(){
    console.log($scope.currentNumWeeks);
    $scope.flightTotal = 0;
    for (var j = 1; j <= $scope.currentNumWeeks; j++) {
      $scope.flightTotal = $scope.flightTotal + $scope.totals['week'+j].total;
      console.log('flightTotal:', $scope.flightTotal);
    }
    console.log('totals:',$scope.totals);
  };

  $scope.incrementCount = function(thisWeek, thisHour, thisDay, $event) {
    console.log('in incrementCount, with:', thisDay, thisHour, thisWeek, $event.target);
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
    var clientToSend = {
      // client: $scope.client,
      // client_id: $scope.client_id,
      client_contact: $scope.clientContact,
      phone: $scope.phone,
      cell: $scope.cell,
      fax: $scope.fax,
      email: $scope.email,
      website: $scope.website,
      street: $scope.street,
      city: $scope.city,
      zip: $scope.zip
    };
    console.log('UW clientToSend:', clientToSend);

    $http({
      method: 'POST',
      url: '/client',
      data: clientToSend,
    }).then(function (response){
          console.log('success in uwCtrl client post route:', response);
        }, function (error) {
          console.log('error in uwCtrl client post route:', error);
        }); // end then function

        var flightInfo = {
          start_date: $scope.startDate,
          end_date: $scope.endDate,
        };

        $http({
          method: 'POST',
          url: '/flight',
          data: flightInfo,
        }).then(function (response){
              console.log('success in uwCtrl traffic post route:', response);
            }, function (error) {
              console.log('error in uwCtrl traffic post route:', error);
            }); // end then function
  }; // end submitRunSheetEntry

}]); // end uwController
