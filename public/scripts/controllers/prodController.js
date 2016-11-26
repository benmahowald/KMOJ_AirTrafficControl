app.controller('prodController', ['$scope', '$http', function($scope, $http){
  console.log('Production Controller');

  $scope.productionSaved = false;

  $scope.productions = [];

  $scope.getProductions = function (){
    console.log('in getProductions');
    $http({
      method: 'GET',
      url: '/production/productionInfo'
    }).then(function(response){
      $scope.productions = response.data;
      console.log ($scope.productions);
      // $scope.start_date = moment($scope.productions[0].start_date).format('ddd, MMM DD YYYY')
      // $scope.end_date = moment($scope.productions[0].end_date).format('ddd, MMM DD YYYY');
    }, function errorCallback(response){
      console.log('error getting productions', response);
    });
  };

  $scope.retrieveProdId = function(id){
    $scope.currentProdId = id;
    console.log('currentProdId is ', $scope.currentProdId);

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
    url: '/production/production?q=' + $scope.currentProdId,
    data: prodToSend
  }).then(function (response){
        console.log('success in prodCtrl post route:', response);
        $scope.productionSaved = true;
        $scope.clearFields();
      }, function (error) {
        console.log('error in prodCtrl post route:', error);
      }); // end then function
}; // end http call

$scope.getCartNum = function () {
  console.log('in getCartNum');
  $http({
    method: 'GET',
    // whatever url Luis uses
    url: '/traffic/cart_number?q=' + $scope.currentContractId,
  }).then(function (response){
        $scope.cart_number = response.data[0].cart_number;
        console.log('$scope.cart_number = ', $scope.cart_number);
      }, function (error) {
        console.log('error in cart_number get;', error);
      }); // end then function
  }; // end getCartNum

  $scope.updateCartNum = function (cart_number) {
    console.log('Current Contract Id:', $scope.currentContractId);
    console.log('in updateCartNum', cart_number);
    $http({
      method: 'PUT',
      url: '/traffic/cart_number?q=' + $scope.currentContractId,
      data: cart_number
    }).then($scope.getCartNum);
}; // end updateCartNum

  $scope.clearFields = function () {
    $scope.talent = '';
    $scope.who = '';
    $scope.what = '';
    $scope.site = '';
    $scope.why = '';
    $scope.cart_number = '';
    $scope.producer = '';
    $scope.spot_length = '';
    $scope.event_name = '';
  }; // end clearFields

}]); // end production controller
