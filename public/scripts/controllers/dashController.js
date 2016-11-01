app.controller('dashController', ['$scope', '$http', function($scope, $http) {
  console.log('Dashboard Controller');

  $scope.submitClient = function (){
    console.log('in submitClient');
    var clientToSend = {
      client_name: $scope.client_name,
      // client_id: $scope.client_id,
      contact: $scope.contact,
      phone: $scope.phone,
      cell: $scope.cell,
      fax: $scope.fax,
      email: $scope.email,
      website: $scope.website,
      street: $scope.street,
      city: $scope.city,
      state: $scope.state,
      zip: $scope.zip
      // users_id: $scope.userProfile.users_id
    };
    console.log('clientToSend -----------', clientToSend);

    // post route to create a new client
    $http({
      method: 'POST',
      url: '/client',
      data: clientToSend,
    }).then(function (response){
          console.log('success in dash client post route:', response);
        }, function (error) {
          console.log('error in dash client post route:', error);
        }); // end then function
    $scope.clearCreateClient();
  }; //end submitClient

  $scope.clientNameList = [];

  // retrieves all clients and pushs each name into clientNameList array
  // for client drop down meny
  $scope.getAllClients = function () {
    $http({
      method: 'GET',
      url: '/client',
    }).then(function (response){
          $scope.allClients = response.data;
          console.log('getAllClients success:', $scope.allClients);
          for (var i = 0; i < $scope.allClients.length; i++) {
            $scope.clientNameList.push($scope.allClients[i].name);
            console.log('client name:' + i + " " + $scope.allClients[i].name);
          }
        }, function (error) {
          console.log('error in getAllClients;', error);
        }); // end then function
        console.log('outside http call:', $scope.clientNameList);
    }; // end getAllClients


  $scope.getAllClients();

  // calls for xeditable functionality to edit client info
  $scope.getClient = function () {
    $http({
      method: 'GET',
      url: '/client/' + $scope.selectedName,
    }).then(function (response){
          console.log('get manage account success:', response.data);
          $scope.clientData = response.data;
        }, function (error) {
          console.log('error in get;', error);
        }); // end then function
    }; // end getClients

    $scope.getClient();

    $scope.updateClient = function(data) {
		  console.log( 'Data', data );
  		$http({
  			method: 'PUT',
  			url: '/client/' + $scope.client_id,
  			data: data
  		}).then($scope.getClient);
    }; // end updateClient

  $scope.clearCreateClient = function () {
    $scope.client_name = '';
    // $scope.client_id
    $scope.contact = '';
    $scope.phone = '';
    $scope.cell = '';
    $scope.fax = '';
    $scope.email = '';
    $scope.website = '';
    $scope.street = '';
    $scope.city = '';
    $scope.state = '';
    $scope.zip = '';
  }; // end clearCreateClient

}]); // end dashController
