app.controller('uwController', ['$scope', function($scope){
  console.log('Underwriter Controller');

  $scope.weeks = {week1:{}};
  $scope.currentNumWeeks = 1;
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
}]);
