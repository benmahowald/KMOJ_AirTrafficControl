app.controller('prodController', ['$scope', '$http', function($scope, $http){
  console.log('Production Controller');


  $scope.productions = [];

  $scope.getProductions = function (){
    console.log('in getProductions');
    $http({
      method: 'GET',
      url: '/production/productionInfo'
    }).then(function(response){
      $scope.productions = response.data;
      console.log ($scope.productions);
    }, function errorCallback(response){
      console.log('error getting productions', response);
    });
  };


  $scope.sendProduction = function(){
    var prodToSend = {
    talent: $scope.talent,
    who: $scope.who,
    what: $scope.what,
    site: $scope.site,
    why: $scope.why,
    cart_number: $scope.cart_number,
    producer: $scope.producer,
    spot_length: $scope.spot_length,
    complete_date: new Date()
  };

  console.log('prodToSend', prodToSend);

  $http({
    method: 'POST',
    url: '/production/production',
    data: prodToSend
  }).then(function (response){
        console.log('success in prodCtrl post route:', response);
      }, function (error) {
        console.log('error in prodCtrl post route:', error);
      }); // end then function
}; 


}]);
