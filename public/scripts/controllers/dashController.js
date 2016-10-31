app.controller('dashController', ['$scope', '$http', function($scope, $http) {
  console.log('Dashboard Controller');

  $scope.submitClient = function (){
    console.log('in submitClient');
    var clientToSend = {
      client: $scope.clientz,
      // client_id: $scope.client_id,
      client_contact: $scope.client_contact,
      phone: $scope.phone,
      cell: $scope.cell,
      fax: $scope.fax,
      email: $scope.email,
      website: $scope.website,
      street: $scope.street,
      city: $scope.city,
      zip: $scope.zip
    };
    console.log('clientToSend -----------', clientToSend);

    $http({
      method: 'POST',
      url: '/client',
      data: clientToSend,
    }).then(function (response){
          console.log('success in uwCtrl client post route:', response);
        }, function (error) {
          console.log('error in uwCtrl client post route:', error);
        }); // end then function
  }; //end submitClient

  // $scope.getClient = function () {
  //   $http({
  //     method: 'GET',
  //     url: '/client/' + $scope.client_id,
  //   }).then(function (response){
  //         console.log('get manage account success:', response.data);
  //         $scope.clientData = response.data;
  //       }, function (error) {
  //         console.log('error in get;', error);
  //       }); // end then function
  //   }; // end getClients
  //
  //   $scope.getClient();
  //
  //   $scope.updateClient = function(data) {
	// 	  console.log( 'Data', data );
  // 		$http({
  // 			method: 'PUT',
  // 			url: '/client/' + $scope.client_id,
  // 			data: data
  // 		}).then($scope.getClient);

}]); // end dashController
