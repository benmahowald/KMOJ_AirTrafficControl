var app = angular.module('App', ['ngRoute', 'firebase', 'ngMaterial', 'xeditable']);

app.controller('authController', function($scope, $firebaseArray, $firebaseAuth, $http) {
  var auth = $firebaseAuth();
  console.log('in authController');

//current logged in user data from database
// $scope.userData;

  //User login
  $scope.logIn = function(){
    console.log('in logIn()');
    auth.$signInWithEmailAndPassword($scope.userEmail, $scope.userPassword).then(function(firebaseUser) {
      console.log("Authentication Success!");
      $scope.loggedIn = true;
      console.log("return from DB after login. FirebaseUser=",firebaseUser);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });//end catch error
  };//end logIn()

  //Authentication state change
  auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/auth/Login',
          headers: {
            id_token: idToken
          }//end header object
        }).then(function(response){
          $scope.userData = response.data;
          console.log($scope.userData);
          console.log('user permission is', $scope.userData[0].permission);
          //show logout button
          $scope.loggedIn = true;
          //clear login input fields
          $scope.userEmail = "";
          $scope.userPassword="";
        });//end response
      });//end return idToken
    }//end if(firebaseUser)
    else{
      console.log('Not logged in.');
      $scope.signedIn = "Please login";
      //show login
      $scope.loggedIn = false;
    }//end else
  });//end onAuthStateChanged()


  //User logout
  $scope.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
      $scope.loggedIn = false;
    });//end signOut
  };//end logOut



});//end authController

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

  $routeProvider.
  when('/admin', {
    templateUrl: '/views/partials/adminView.html',
    controller: 'adminController'
  }).
  when('/admin/employees', {
    templateUrl: '/views/partials/adminAuthorizationView.html',
    controller: 'adminController'
  }).
  when('/admin/report', {
    templateUrl: '/views/partials/reportView.html',
    controller: 'reportController'
  }).
  when('/production', {
    templateUrl: '/views/partials/prodView.html',
    controller: 'prodController'
  }).
  when('/search', {
    templateUrl: '/views/partials/searchView.html',
    controller: 'searchController'
  }).
  when('/traffic', {
    templateUrl: '/views/partials/trafficView.html',
    controller: 'trafficController'
  }).
  when('/underwriter', {
    templateUrl: '/views/partials/uwNewView.html',
    controller: 'uwController'
  }).
  when('/underwriter/createClient', {
    templateUrl: '/views/partials/dashView.html',
    controller: 'dashController'
  }).
  when('/underwriter/editClient', {
    templateUrl: '/views/partials/uwEditClientView.html',
    controller: 'dashController'
  }).
  when('/underwriter/aired', {
    templateUrl: '/views/partials/uwAiredView.html',
    controller: 'uwController'
  }).
  when('/underwriter/contracts', {
    templateUrl: '/views/partials/uwPendingView.html',
    controller: 'uwController'
  }).
  when('/viewall', {
    templateUrl: '/views/partials/index.html'
  }).
  when('/', {
    templateUrl: '/views/partials/home.html',
  }).
  otherwise({
    redirectTo: '/'
  });

  // use the HTML5 History API for pretty URLs
  $locationProvider.html5Mode(true);
}]);// end NG-routing

// navbar collapse on click of anchor
$(document).on('click','.navbar-collapse.in',function(e) {
  if( $(e.target).is('a') ) {
    $(this).collapse('hide');
  } // end if statement
}); // end document ready
