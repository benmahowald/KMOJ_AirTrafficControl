app.controller('uwController', ['$scope', function($scope){
  console.log('Underwriter Controller');
  //// code for the traffic entry grid
  // Initialize variables
  // weeks will hold the actual scheduling information
  $scope.weeks = {week1:{}};
  $scope.totals = {};
  $scope.currentNumWeeks = 1;
  // This object is used as a scaffold help build the grid
  $scope.hours = {
    am2: {text:'2am-5am', name:'am2'},
    am5: {text:'5am-6am', name:'am5'},
    am6: {text:'6am-10am', name:'am6'},
    am10: {text:'10am-2pm', name:'am10'},
    pm2: {text:'2pm-6pm', name:'pm2'},
    pm6: {text:'6pm-7pm', name:'pm6'},
    pm7: {text:'7pm-10pm', name:'pm7'},
    pm10: {text:'10pm-2am', name:'pm10'}
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
        $scope.weeks['week'+i]={};
        $scope.currentNumWeeks++;
      }
    }
  };

  $scope.updateTotal = function(thisHour){

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
