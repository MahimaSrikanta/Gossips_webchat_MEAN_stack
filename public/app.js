var app = angular.module("myapp", ['ngRoute', 'ngCookies']);
                   //Routing
                   app.config(function($routeProvider, $locationProvider) {
                       $routeProvider
                       .when('/', {
                           templateUrl: 'home.html',
                           controller: 'Homectrl',
                        })
                        
                        .when('/signup', {
                           templateUrl: 'signup.html',
                           controller: 'Signupctrl',
                        });
                        
                        

                     });
                     
                     app.run(function($rootScope, $cookies){
                         if ($cookies.get('token') && $cookies.get('currentUser')){
                             $rootScope.token = $cookies.get('token');
                             $rootScope.currentUser = $cookies.get('currentUser');
                             
                         }
                     });
                     
                   
                   app.controller("Homectrl", function($rootScope, $scope, $http, $cookies,$route){
                       var date = new Date();
                     
                        $scope.addNew = function(){
                            //console.log($scope.newMewo);
                            $http.post("/me", {new: $scope.newMewo, date: date},{headers:{'authorization':$rootScope.token}}).then(function(){
                               // alert("success"); 
                                getmewos();
                                $scope.newMewo = '';
                            });
                               
                         }
                         
                        function getmewos(){                     
                       $http.get("/mew" ).then (function(response){
                            $scope.mewos = response.data;
                           
                       });
                   }
                   getmewos();
                   
                   //Deleting the posts
                   $scope.removeMewo = function(mewo){
                       console.log(mewo);
                           $http.put("/remove", {delmewo:mewo},{headers:{'authorization':$rootScope.token}}).then(function(){
                               // alert("success"); 
                               
                                getmewos();
                                
                            }, function(err){
                                alert("error");
                            });
                       
                   };
                   
                   //Signin 
                   $scope.login = function(){
                         $http.put("/user/login", {username : $scope.username, password : $scope.password}).then(function(res){
                            
                            $cookies.put('token', res.data.token);
                            $cookies.put('currentUser', $scope.username);
                            $rootScope.currentUser = $scope.username;
                            $rootScope.token = res.data.token;
                            $rootScope.username = $scope.username;
                             
                                
                            }, function (err){
                                alert("Error");
                            });
                       
                   }
                   $scope.logout = function(){
                       
                            $cookies.remove('token');
                            $cookies.remove('currentUser');
                            $rootScope.token = null;
                            $rootScope.username = null;
                            $rootScope.currentUser = null;
                            $route.reload();
                       
                   }
                   });
                   
                    app.controller("Signupctrl", function($scope, $http){
                        $scope.addUser = function(){
                            var user = {
                                username : $scope.username,
                                password : $scope.password,
                        }
                        $http.post("/users", user).then(function(){
                               alert("Thanks for Signing-up , go back to login page to Login and start Gossiping"); 
                        });
                        
                    }
                    });