app.controller('prodController', ['$scope', '$http', function($scope, $http){
  console.log('Production Controller');


$scope.sendProduction = function(){
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

  $http({
    method: 'POST',
    url: '/production76',
    data: prodToSend
  }).then(function(response){
    console.log('post response for production ', response);
  }, function errorCallback(response){
     console.log ('err', response);
  });
}
  // get call to retrieve some info from master doc

//   var prodToSend = {
//     voice_talent: $scope.voice_talent,
//     producer: $scope.producer,
//     spot_length: $scope.spot_length,
//     cart_number: $scope.cart_number,
//     who: $scope.who,
//     where: $scope.where,
//     what: $scope.what,
//     why: $scope.why,
//     complete_date: new Date()
//   }; // end prodToSend
//
// // send data onto server through post route
// $scope.sendProduction = function () {
//   console.log('prodToSend', prodToSend);
//   $http({
//     method: 'POST',
//     url: '/production',
//     data: prodToSend,
//   }).then(function (response){
//         console.log('success in prodCtrl post route:', response);
//       }, function (error) {
//         console.log('error in prodCtrl post route:', error);
//       }); // end then function
// }; // end sendProduction

}]);
