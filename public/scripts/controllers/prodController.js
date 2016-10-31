app.controller('prodController', ['$scope', '$http', function($scope, $http){
  console.log('Production Controller');



  var prodToSend = {
    talent: $scope.talent,
    who: $scope.who,
    what: $scope.what,
    site: $scope.site,
    why: $scope.why,
    cart_number: $scope.cart_number,
    producer: $scope.producer,
    complete_date: new Date()
  };


// send data onto server through post route
$scope.sendProduction = function (prodtoSend) {
  console.log('prodToSend', prodToSend);
  $http({
    method: 'POST',
    url: '/production76',
    data: prodToSend
  }).then(function (response){
        console.log('success in prodCtrl post route:', response);
      }, function (error) {
        console.log('error in prodCtrl post route:', error);
      }); // end then function
}; // end sendProduction


}]);
