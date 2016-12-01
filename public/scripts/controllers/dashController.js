app.controller('dashController', ['$scope', '$http', function($scope, $http) {
  // console.log('Dashboard Controller');

$scope.clientSaved = false;

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
      webiste: $scope.webiste,
      street: $scope.street,
      city: $scope.city,
      state: $scope.state,
      zip: $scope.zip
      // users_id: $scope.userProfile.users_id
    };
    console.log('clientToSend -', clientToSend);
    if($scope.createClient.client_name.$valid){
    // post route to create a new client
    $http({
      method: 'POST',
      url: '/client',
      data: clientToSend,
    }).then(function (response){
          console.log('success in dash client post route:', response);
          $scope.clientSaved = true;
          $scope.clearCreateClient();
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }, function (error) {
          console.log('error in dash client post route:', error);
        }); // end then function
  }else {
    console.log('$scope.createClient.client_name =',$scope.createClient.client_name);
  }
  }; //end submitClient

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


    $scope.getClient();

    $scope.updatedClient = {};

    $scope.updateClient = function(data) {
      console.log('in updateClient');
		  console.log( 'Data', data );
      for (var field in data) {
        if (data.hasOwnProperty(field)) {
          $scope.updatedClient[field] = data[field];
        }
      }
      console.log('$scope.updatedClient = ', $scope.updatedClient);
    }; // end updateClient

    $scope.sendUpdatedClient = function () {
    $http({
    	method: 'PUT',
    	url: '/client?q=' + $scope.selectedName,
    	data: $scope.updatedClient
    }).then($scope.getClient);
  }; // end sendUpdatedClient

  $scope.deleteClient = function () {
    console.log('delete clicked');
    $http({
    	method: 'DELETE',
    	url: '/deleteClient?q=' + $scope.selectedName,
    }).then($scope.getClient);
  }; // end sendUpdatedClient

  $scope.clearCreateClient = function () {
    $scope.client_name = null;
    // $scope.client_id
    $scope.contact = null;
    $scope.phone = null;
    $scope.cell = null;
    $scope.fax = null;
    $scope.email = null;
    $scope.webiste = null;
    $scope.street = null;
    $scope.city = null;
    $scope.state = null;
    $scope.zip = null;
  }; // end clearCreateClient

//////////////////////////////////// Contract Stuff ////////////////////////

$scope.getMasterDocs = function () {
  console.log('in getMasterDocs');
  $http({
    method: 'GET',
    url: '/master' + $scope.selectedName,
  }).then(function (response){
        $scope.MasterData = response.data;
        console.log('$scope.clientData = ', $scope.MasterData);
      }, function (error) {
        console.log('error in get;', error);
      }); // end then function
}; // end getContracts

}]); // end dashController
