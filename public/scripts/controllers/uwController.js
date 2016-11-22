app.controller('uwController', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http){
  console.log('Underwriter Controller');
  //// code for the traffic entry grid
  // Initialize variables
  // weeks will hold the actual scheduling information
  $scope.weeks = {week1:{num: 1}};
  $scope.totals = {week1:{total: 0}};
  $scope.currentNumWeeks = 1;
  // This object is used as a scaffold help build the grid
  $scope.hours = {
    am2: {fullText:'2a-5a', title:'am2'},
    am5: {fullText:'5a-6a', title:'am5'},
    am6: {fullText:'6a-10a', title:'am6'},
    am10: {fullText:'10a-2p', title:'am10'},
    pm2: {fullText:'2p-6p', title:'pm2'},
    // This hour is removed because it is not scheduled by UWs
    // pm6: {fullText:'6p-7p', title:'pm6'},
    pm7: {fullText:'7p-10p', title:'pm7'},
    pm10: {fullText:'10p-2a', title:'pm10'}
  };
  // This is used to populate the header and scaffold the grid
  $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  console.log($scope.hours);

  $scope.buildFlight = function(){
    console.log($scope.weeks);

    var numDays = $scope.currentNumWeeks * 7; // seven days in a weeks
    var dayIndex;
    var dayCheck;
    $scope.slotDBinfo = [];
    slotIndex = 0;

    for (var m = 1; m <= numDays; m++) {
      numWeek = Math.ceil(m/7);
      dayIndex = (m-1)-(7*(numWeek-1));
      dayCheck = $scope.days[dayIndex];
      console.log('numWeek:', numWeek);
      for (var hour in $scope.hours) {
        if ($scope.hours.hasOwnProperty(hour)) {
          if ($scope.weeks['week'+numWeek][hour]){
            if ($scope.weeks['week'+numWeek][hour][dayCheck]) {
              $scope.slotDBinfo[slotIndex] = {
                dayOfRun: m,
                plays: $scope.weeks['week'+numWeek][hour][dayCheck],
                slot: $scope.hours[hour].fullText
              };
              slotIndex++;
            }
          }
        }
      } // end for in loop
    } // end for loop

    console.log('slotDBinfo:', $scope.slotDBinfo);
  }; // end buildFlight()

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

  $scope.checkInput = function(thisWeek, thisHour, thisDay){
    console.log('in checkInput, with:', thisDay, thisHour, thisWeek);
    var weekName = 'week'+thisWeek;

    if ($scope.weeks[weekName][thisHour][thisDay]<0) {
      $scope.weeks[weekName][thisHour][thisDay]=0;
    } else if ($scope.weeks[weekName][thisHour][thisDay]>20){
      $scope.weeks[weekName][thisHour][thisDay]=20;
    }

    $scope.updateTotals(thisWeek, thisHour, thisDay);
  };

  $scope.updateTotals = function(thisWeek, thisHour, thisDay){
    console.log('in updateTotals, with:', thisDay, thisHour, thisWeek);
    var weekName = 'week'+thisWeek;
    // Reset counters
    $scope.totals[weekName][thisHour] = 0;
    $scope.totals[weekName].total = 0;
    var dayCheck;
    // check to see if anything has been recorded yet
    for (var k = 0; k < $scope.days.length; k++) {
      dayCheck = $scope.days[k];
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
    for (var l = 1; l <= $scope.currentNumWeeks; l++) {
      $scope.flightTotal = $scope.flightTotal + $scope.totals['week'+l].total;
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

  $scope.submitRunSheetEntry = function (ev){
    console.log('in submitRunSheetEntry');
    var requiredFields = 'The following fields are required or have errors:';
    if (!$scope.event_name) {
      requiredFields += ' - Event';
    }
    console.log($scope.clientData);
    if (!$scope.clientData) {
      requiredFields += ' - Client';
    }
    if (!$scope.startDate) {
      requiredFields += ' - Start Date';
    } else {
      $scope.startDateTime = moment($scope.startDate).format();
    }
    if (!$scope.endDate) {
      requiredFields += ' - End Date';
    } else {
      $scope.endDateTime = moment($scope.endDate).format();
    }
    if ($scope.startDate && $scope.endDate) {
      if (moment($scope.startDateTime).isAfter(moment($scope.endDateTime))) {
        requiredFields += ' - Start Date after End Date';
      }
    }
    if (!$scope.fa && !$scope.psa) {
      requiredFields += ' - FA / PSA';
    }
    if (!$scope.instructions) {
      $scope.instructions = 'None';
    }
    if (!$scope.discount) {
      $scope.discount = 0;
    }
    console.log($scope.agency_commission);
    if (!$scope.agency_commission) {
      $scope.agency_commission = 0;
    }

    // Check the totals for an empty week
    var emptyWeek = false;
    for (var week in $scope.totals) {
      if ($scope.totals.hasOwnProperty(week)) {
        if ( $scope.totals[week].total === 0 ) {
          emptyWeek = true;
        }
      }
    }
    $scope.buildFlight();
    if ($scope.slotDBinfo.length === 0 || emptyWeek) {
      requiredFields += ' - Traffic Flight Grid';
    }
    $scope.spotLength = ':30';
    if (!$scope.spotLength){
      requiredFields += ' - Spot Length';
    }
    $scope.totalCost = '0.00';
    if (!$scope.totalCost){
      requiredFields += ' - Total Cost';
    }
    if (!$scope.numInterviews){
      $scope.numInterviews = 0;
    }
    if (!$scope.numSocialMedia){
      $scope.numSocialMedia = 0;
    }
    if (!$scope.voiceTalent){
      $scope.voiceTalent = '';
    }
    if (!$scope.producer){
      $scope.producer = '';
    }
    if (!$scope.whoText){
      $scope.whoText = '';
    }
    if (!$scope.whatText){
      $scope.whatText = '';
    }
    if (!$scope.whyText){
      $scope.whyText = '';
    }
    if (!$scope.moreInfoText){
      $scope.moreInfoText = '';
    }

    console.log('userData:', $scope.userData);
    console.log(requiredFields);
    if (requiredFields !== 'The following fields are required or have errors:'){
      $scope.showAlert = function(ev) {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Error in Required Field!')
          .textContent(requiredFields)
          .ariaLabel('Required Field Alert')
          .ok('Understood')
          .targetEvent(ev)
        );
      };
      $scope.showAlert();
    } else {

      var contractToSend = {
        user_id: $scope.userData[0].id,
        event_name: $scope.event_name,
        client_id: $scope.clientData[0].client_id,
        start_date: $scope.startDate,
        end_date: $scope.endDate,
        fa: $scope.fa,
        psa: $scope.psa,
        instructions: $scope.instructions,
        discount: $scope.discount,
        agency_commission: $scope.agency_commission,
        slotInfo: $scope.slotDBinfo,
        signDate: moment(new Date()).format(),
        spotLength: $scope.spotLength,
        totalCost: $scope.totalCost,
        numInterviews: $scope.numInterviews,
        numSocialMedia: $scope.numSocialMedia,
        voiceTalent: $scope.voiceTalent,
        producer: $scope.producer,
        whoText: $scope.whoText,
        whatText: $scope.whatText,
        whyText: $scope.whyText,
        moreInfoText: $scope.moreInfoText
      };

      console.log('UW contractToSend:', contractToSend);

      $http({
        method: 'POST',
        url: '/underwriter/master',
        data: contractToSend
      }).then(function (response){
        console.log('success in uwCtrl client post route:', response);
      }, function (error) {
        console.log('error in uwCtrl client post route:', error);
      }); // end then function
    }
  }; // end submitRunSheetEntry

  $scope.clientNameList = [];

  // retrieves all clients and pushs each name into clientNameList array
  // for client drop down meny
  $scope.getAllClients = function () {
    console.log('in getAllClients');
    $http({
      method: 'GET',
      url: '/clients',
    }).then(function (response){
      $scope.allClients = response.data;
      // console.log('getAllClients success:', $scope.allClients);
      for (var i = 0; i < $scope.allClients.length; i++) {
        $scope.clientNameList.push($scope.allClients[i].name);
      }
    }, function (error) {
      console.log('error in getAllClients;', error);
    }); // end then function
  }; // end getAllClients

  $scope.getAllClients();

  // calls for xeditable functionality to edit client info
  $scope.getClient = function () {
    console.log('in getClient');
    console.log('selectedName:', $scope.selectedName);
    $http({
      method: 'GET',
      url: '/client?q=' + $scope.selectedName,
    }).then(function (response){
      $scope.clientData = response.data;
      console.log('$scope.clientData = ', $scope.clientData);
    }, function (error) {
      console.log('error in get;', error);
    }); // end then function
  }; // end getClients


}]); // end uwController
