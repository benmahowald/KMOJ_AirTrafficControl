app.controller("adminController",["$scope","$http",function($scope,$http){
  console.log('Admin Controller');


  console.log("in adminController $scope.userData",$scope.userData);


  $scope.authLevels = [
    { permission: 'Administration'},
    { permission: 'Underwriter'},
    { permission: 'Production'},
    { permission: 'Traffic'},
    { permission: 'View Only Production and Traffic'},
    { permission: 'View All'}
  ];//end scope.authLevels

  //clear input fields
  var clearFields=function(){
    $scope.newUserName = "";
    $scope.newUserEmail="";
    $scope.newUserPassword = "";
    $scope.auth= $scope.authLevels;
  }; //end clearFields

  //array to hold users
  $scope.users = [];

  var viewUsers = function(){
    $http({
      method: 'GET',
      url: 'admin/userList'
    }).then(function(response){
      // console.log('returned from server ', response);
      $scope.users = response.data;
    }); //end return
  };//end viewUsers

  //view users on DOM when page is loaded
  viewUsers();

  $scope.createNewUser = function(){
    //clear $scope.newUserEmail if you have trouble with creating a user and it states "email is not a string"
    if(firebase.auth().currentUser) {

      console.log("firebase.auth().currentUser",firebase.auth().currentUser);

      console.log("$scope.newUserEmail",$scope.newUserEmail);
      // console.log("$scope.auth.permission",$scope.auth.permission);
      secondaryApp.auth().createUserWithEmailAndPassword($scope.newUserEmail, $scope.newUserPassword)
      .then(function(firebaseUser) {
        console.log("$scope.newUserEmail",$scope.newUserEmail);
        console.log("User " + firebaseUser.email + " created successfully!");
        secondaryApp.auth().signOut();
        firebase.auth().currentUser.getToken()
        .then(function(idToken){
          $http({
            method: 'POST',
            url: '/admin/createNewUser',
            headers: {
              id_token: idToken
            },//end header object
            data: {
              email: $scope.newUserEmail,
              permission: $scope.auth.permission,
              name: $scope.newUserName,
              active: true
            }//end data object
          })//end http
          .then(function(response){
            $scope.createNewUserResponse = response.data;
            console.log(response);
            // clearView();
            clearFields();
            viewUsers();
          });//end response
        });//end http call /createNewUser
      });//success in creating new user in firebase
    }//end if
    else {
      console.log('Log in to create a new user');
      // clearView();
      clearFields();
    }//end else
  };//end createNewUser()

  $scope.changeActiveStatus = function(){
    var activeStatus;
    if (this.user.active) {
      activeStatus = false;
    }//end if
    else {
      activeStatus = true;
    }//end else
    console.log("active status",activeStatus);
    $http({
      method: 'PUT',
      url: 'admin/changeActiveStatus',
      data: {id: this.user.id,
        active: activeStatus
      }//end data
    }).then(function(response){
      console.log("response from changeActiveStatus",response);
      viewUsers();
    });//end reponse from server
  }//end changeActiveStatus

  //Delete a user
  $scope.deleteUser = function(){
    $http({
      method: 'DELETE',
      url: '/admin/deleteUser',
      data: {id: this.user.id},
      headers: {"Content-Type": "application/json;charset=utf-8"}
    }).then(function(response){
      console.log('returned from server ', response);
      viewUsers();
    });//end response from server
  };//end deleteUser

  pendingContracts = function(){
    console.log('in pendingContracts');
    $http({
      method: 'GET',
      url: '/admin/pendingContracts',
    }).then(function(response){
      $scope.pendingContracts = response.data;
      console.log('$scope.pendingContracts', $scope.pendingContracts);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end pendingContracts
  pendingContracts();

  approvedContracts = function(){
    console.log('in approvedContracts');
    $http({
      method: 'GET',
      url: '/admin/approvedContracts',
    }).then(function(response){
      $scope.approvedContracts = response.data;
      console.log('$scope.pendingContracts', $scope.approvedContracts);
    }, function errorCallback (response){
      console.log('err', response);
    }); // end then
  }; // end approvedContracts
  approvedContracts();

  $scope.managerApproval = function(){
    var managerApproval;
    console.log('MANAGER APPROVAL this.data',this.data);
    if (this.data.man_app) {
      managerApproval = false;
    }//end if
    else {
      managerApproval = true;
    }//end else
    console.log("approval status",managerApproval);
    $http({
      method: 'PUT',
      url: 'admin/managerApproval',
      data: {id: this.data.id,
        man_app: managerApproval
      }//end data
    }).then(function(response){
      console.log("response from managerApproval",response);
      pendingContracts();
      approvedContracts();
    });//end reponse from server
  }//end managerApproval

}]);//end adminController
