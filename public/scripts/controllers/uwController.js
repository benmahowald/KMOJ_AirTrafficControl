app.controller('uwController', ['$scope', '$mdDialog', '$http',  function($scope, $mdDialog, $http){
  console.log('Underwriter Controller');
  //---- INITIALIZE VARIABLES
  // weeks will hold the actual scheduling information
  $scope.weeks = {week1:{num: 1}};
  // totals will keep track of the totals for each week
  $scope.totals = {week1:{total: 0}};
  $scope.currentNumWeeks = 1; // current number of weeks be in rotation
  $scope.contractSaved = false;
  // This object is used to help scaffold the grid, and name properties in object
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
  // This is used to populate the header, scaffold the grid, and name properties in object
  $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  $scope.clientNameList = []; // initialize array


  //---- DECLARE FUNCTIONS
  $scope.buildFlight = function(){
    console.log('In buildFlight');
    console.log('scope.weeks:', $scope.weeks);

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

  $scope.calcFlightTotal = function(){
    console.log($scope.currentNumWeeks);
    $scope.flightTotal = 0;
    for (var l = 1; l <= $scope.currentNumWeeks; l++) {
      $scope.flightTotal = $scope.flightTotal + $scope.totals['week'+l].total;
      console.log('flightTotal:', $scope.flightTotal);
    }
    console.log('totals:',$scope.totals);
  }; // end calcFlightTotal

  $scope.checkInput = function(thisWeek, thisHour, thisDay){
    console.log('in checkInput, with:', thisDay, thisHour, thisWeek);
    var weekName = 'week'+thisWeek;

    if ($scope.weeks[weekName][thisHour][thisDay]<0) {
      $scope.weeks[weekName][thisHour][thisDay]=0;
    } else if ($scope.weeks[weekName][thisHour][thisDay]>20){
      $scope.weeks[weekName][thisHour][thisDay]=20;
    }

    $scope.updateTotals(thisWeek, thisHour, thisDay);
  }; // end checkInput

  $scope.clearFields = function () {
    console.log('in clearFields');
    $scope.event_name = null;
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.fa = null;
    $scope.psa = null;
    $scope.instructions = null;
    $scope.discount = null;
    $scope.agency_commission = null;
    $scope.slotDBinfo = null;
    $scope.totalCost = null;
    $scope.numInterviews = null;
    $scope.numSocialMedia = null;
    $scope.spot_rate = null;
    $scope.selectedName = null;
    $scope.talent = null;
    $scope.who = null;
    $scope.what = null;
    $scope.site = null;
    $scope.why = null;
    $scope.producer = null;
    $scope.spot_length = null;
    $scope.event_name = null;
  }; // end clearFields

  $scope.getAllClients = function () {
    // retrieves all clients and pushs each name into clientNameList array
    // for client drop down meny
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

  $scope.getClient = function () {
    // calls for xeditable functionality to edit client info
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
  }; // end getClient

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
  }; // end incrementCount

  $scope.submitRunSheetEntry = function (ev){
    console.log('in submitRunSheetEntry');
    // These lines will build the "required fields" message
    // Initialize the message string
    var requiredFields = 'The following fields are required or have errors:';
    if (!$scope.event_name) { // if there is no Event Name
      requiredFields += ' - Event'; // add it to the error message
    }
    if (!$scope.clientData) { // if there is no Client Data
      requiredFields += ' - Client'; // add it to the error message
    }
    if (!$scope.startDate) { // if there is no Start Date
      requiredFields += ' - Start Date'; // add it to the error message
    } else { // otherwise
      $scope.startDateTime = moment($scope.startDate).format(); // format it
    }
    if (!$scope.endDate) { // if there is no End Date
      requiredFields += ' - End Date'; // add it to the error message
    } else { // otherwise
      $scope.endDateTime = moment($scope.endDate).format(); // format it
    }
    if ($scope.startDate && $scope.endDate) { // if we have both Start and End dates
      // check to make sure that the Start Date is not after the End Date
      if (moment($scope.startDateTime).isAfter(moment($scope.endDateTime))) { // if it is
        requiredFields += ' - Start Date after End Date';  // add it to the error message
      }
    }
    if (!$scope.fa && !$scope.psa) { // if neither FA nor PSA is chosen
      requiredFields += ' - FA / PSA'; // add it to the error message
    }
    if (!$scope.instructions) { // if there are no Instructions
      $scope.instructions = 'None'; // Default it to None
    }
    if (!$scope.discount) { // if there is no Discount specified
      $scope.discount = 0; // Default it to Zero
    }
    if (!$scope.agency_commission) { // if there is no Commission specified
      $scope.agency_commission = 0; // Default it to Zero
    }
    if (!$scope.spot_length){ // if there is no Spot Length chosen
      requiredFields += ' - Spot Length'; // add it to the error message
    }
    if (!$scope.spot_rate){ // if there is no Spot Rate chosen
      requiredFields += ' - Spot Rate'; // add it to the error message
    }
    if ($scope.totalCost === undefined){ // if there is no Total Cost specified
      requiredFields += ' - Total Cost'; // add it to the error message
    }
    if (!$scope.numInterviews){ // if no number of Interviews is recorded
      $scope.numInterviews = 0; // Defalut it to Zero
    }
    if (!$scope.numSocialMedia){ // if no number of Social Media Events is recorded
      $scope.numSocialMedia = 0; // Default it to Zero
    }
    if (!$scope.copy_id){ // if no Copy ID is specified
      $scope.copy_id = 'None'; // add defalut message
    }
    if (!$scope.talent){ // if no Voice Talent is specified
      $scope.talent = 'any'; // add defalut message
    }
    if (!$scope.producer){ // if no Producer is specified
      $scope.producer = 'any'; // add default message
    }
    if (!$scope.who){ // if there is no Who Text
      requiredFields += ' - Who Text'; // add it to the error message
    }
    if (!$scope.why){ // if there is no Why Text
      requiredFields += ' - Why Text'; // add it to the error message
    }
    if (!$scope.website){ // if there is no For More Info Text
      requiredFields += ' - For More Info Text'; // add it to the error message
    }
    if (!$scope.what){ // if there is no What Text
      requiredFields += ' - What Text'; // add it to the error message
    }

    // Check the totals for an empty week
    var emptyWeek = false; // set flag to false
    for (var week in $scope.totals) {
      if ($scope.totals.hasOwnProperty(week)) {
        if ( $scope.totals[week].total === 0 ) { // if any week has a total of Zero
          emptyWeek = true; // change flag to true
        }
      }
    }
    $scope.buildFlight(); // go get the information recorded in the Traffic Grid
    if ($scope.slotDBinfo.length === 0 || emptyWeek) { // if there is an empty week
      requiredFields += ' - Traffic Flight Grid'; // add it to the error message
    }

    console.log('userData:', $scope.userData);
    console.log(requiredFields);
    // check error message to see if anything has been added
    if (requiredFields !== 'The following fields are required or have errors:'){
      console.log('Missing Required Field or other error found!');
      // if so, then show the NG-materials error message
      $scope.showAlert = function(ev) {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Error in Required Field(s)!')
          .textContent(requiredFields)
          .ariaLabel('Required Field Alert')
          .ok('Understood')
          .targetEvent(ev)
        );
      };
      $scope.showAlert();
    } else {
      // if not, then go ahead and create the contract in the database
      console.log('Sending a contract to the databaseURL');

      var contractToSend = {
        user_id: $scope.userData[0].id,
        event_name: $scope.event_name,
        client_id: $scope.clientData[0].client_id,
        start_date: moment($scope.startDate).format(),
        end_date: moment($scope.endDate).format(),
        fa: $scope.fa,
        psa: $scope.psa,
        instructions: $scope.instructions,
        discount: $scope.discount,
        agency_commission: $scope.agency_commission,
        slotInfo: $scope.slotDBinfo,
        signDate: moment(new Date()).format(),
        totalCost: $scope.totalCost,
        numInterviews: $scope.numInterviews,
        numSocialMedia: $scope.numSocialMedia,
        spot_rate: $scope.spot_rate,
        total_spots: $scope.flightTotal,
        spot_length: $scope.spot_length,
        copy_id: $scope.copy_id,
        talent: $scope.talent,
        who: $scope.who,
        what: $scope.what,
        site: $scope.website,
        why: $scope.why,
        moreInfo: $scope.moreInfo,
        producer: $scope.producer
      };

      console.log('UW contractToSend:', contractToSend);

      $http({
        method: 'POST',
        url: '/underwriter/master',
        data: contractToSend
      }).then(function (response){
        $scope.eventNameCreated = response.config.data.event_name;
      }, function (error) {
        console.log('error in uwCtrl client post route:', error);
        $scope.clearFields();
        $scope.contractSaved = true;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // $scope.protraffMail();
      }); // end then function

        }//end else
  }; // end submitRunSheetEntry

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
  }; // end trimWeeks

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
  }; // end updateWeeks


  // ---- RUN ON PAGE LOAD
  $scope.getAllClients();

}]); // end uwController
