app.controller('uwController', ['$scope', function($scope){
  console.log('Underwriter Controller');

  $scope.submitMaster = function (){
    console.log('in submitRunSheetEntry');
    var objectToSend = {
      event: $scope.event,
      client: $scope.client,
      client_contact: $scope.clientContact,
      phone: $scope.phone,
      cell: $scope.cell,
      fax: $scope.fax,
      email: $scope.email,
      website: $scope.website,
      street: $scope.street,
      city: $scope.city,
      zip: $scope.zip,
      start_date: $scope.startDate,
      end_date: $scope.endDate,
      fa: $scope.fa,
      psa: $scope.psa,
      instructions: $scope.instructions
    };
    console.log('UW objectToSend:', objectToSend);
  }; // end submitRunSheetEntry

  $scope.submitEventInfo = function () {
    console.log('in submitEventInfo');
  }; //end submitEventInfo

  $scope.submitContactInfo = function () {
    console.log('in submitContactInfo');
  }; //end submitContactInfo

  $scope.submitAddressInfo = function () {
    console.log('in submitAddressInfo');
  }; //end submitAddressInfo

  $scope.submitFlightInfo = function () {
    console.log('in submitFlightInfo');
  }; //end submitFlightInfo
}]); // end uwController
