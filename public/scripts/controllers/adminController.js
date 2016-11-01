app.controller("adminController",["$scope","$http",function($scope,$http){
  console.log('Admin Controller');

  $scope.authLevels = [
    { permission: 'Administration'},
    { permission: 'Underwriter'},
    { permission: 'Production'},
    { permission: 'Traffic'},
    { permission: 'View Only Production and Traffic'}
  ];//end scope.authLevels

//clear input fields
  var clearFields=function(){
    $scope.newUserName = "";
    $scope.newUserEmail="";
    $scope.newUserPassword = "";
    $scope.auth= $scope.authLevels;
  }//end clearFields

  //array to hold users
  $scope.users = [];

  var viewUsers = function(){
    $http({
      method: 'Get',
      url: 'admin/userList'
    }).then(function(response){
      console.log('returned from server ', response);
      $scope.users = response.data;
    })//end return
  };//end viewUsers

  //view users on DOM when page is loaded
  viewUsers();

  //Create a new user
  $scope.createNewUser = function(){
    if(firebase.auth().currentUser) {
      console.log("firebase.auth().currentUser",firebase.auth().currentUser);
      console.log("$scope.auth.permission",$scope.auth.permission);
      secondaryApp.auth().createUserWithEmailAndPassword($scope.newUserEmail, $scope.newUserPassword)
      .then(function(firebaseUser) {
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

}]);//end authController
