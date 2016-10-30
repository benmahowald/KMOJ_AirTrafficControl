var app = angular.module('App', ['ngRoute', 'firebase']);

app.controller('authController', function($scope, $firebaseArray, $firebaseAuth, $http) {
  var auth = $firebaseAuth();

  //Login
  $scope.logIn = function login(){
    auth.$signInWithPopup('google').then(function(firebaseUser) {
      console.log('Signed in as:', firebaseUser.user.displayName);
      $scope.loggedIn = true;
    }).catch(function(error) {
      console.log('Authentication failed:', error);
    });//end error
  };//end logIn

  //runs whenever the user changes authentication states
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/auth/adminLogin',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          $scope.signedIn = response.data;
        });//end response
      });//end getToken
    }//end if
    else {
      console.log('Not logged in.');
      $scope.signedIn = 'Please Login';
    }//end else
  });//end onAuthStateChanged

  //Logout
  $scope.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logged out');
      $scope.loggedIn = false;
    });//end response
  };//end logOut
});//end authController

app.controller('mainController', function($scope, $http) {
  $scope.linkList =[
    {route:'admin',text:'Admin', permission:''},
    {route:'dashboard',text:'Dashboard', permission:''},
    {route:'production',text:'Production', permission:''},
    {route:'report',text:'Report', permission:''},
    {route:'traffic',text:'Traffic', permission:''},
    {route:'underwriter',text:'Underwriter', permission:''}
  ];
});

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  // console.log('$routeProvider:',$routeProvider);

  $routeProvider.
  when('/dashboard', {
    templateUrl: '/views/partials/dashView.html',
    controller: 'dashController'
  }).
  when('/admin', {
    templateUrl: '/views/partials/adminView.html',
    controller: 'adminController'
  }).
  when('/production', {
    templateUrl: '/views/partials/prodView.html',
    controller: 'prodController'
  }).
  when('/report', {
    templateUrl: '/views/partials/reportView.html',
    controller: 'reportController'
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
    templateUrl: '/views/partials/uwView.html',
    controller: 'uwController'
  }).
  otherwise({
    redirectTo: '/dashboard'
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
