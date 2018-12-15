laapp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeBar = true;
}])

.config(function($routeProvider, $controllerProvider, $locationProvider, $filterProvider) {

  $locationProvider.hashPrefix('');

  $routeProvider
  .when('/:controller', {
    templateUrl : function($routeParams) {

      return $routeParams.controller;
    },
    resolve: {
      loadMyCtrl: ['$route','$ocLazyLoad', function($route,$ocLazyLoad) {
        return $ocLazyLoad.load('assets/app/'+$route.current.params.controller+'.js');
      }]
    },
    controller : function($routeParams) {
      return $routeParams.controller;
    }
  })
  .when('/:controller/:function', {
    templateUrl : function($routeParams) {
      return $routeParams.controller+'/'+$routeParams.function;
    },
    resolve: {
      loadMyCtrl: ['$route','$ocLazyLoad', function($route,$ocLazyLoad) {
        return $ocLazyLoad.load('assets/app/'+$route.current.params.controller+'.js');
      }]
    }
  })
  .when('/:controller/:function/:id', {
    templateUrl : function($routeParams) {
      return $routeParams.controller+'/'+$routeParams.function+'/'+$routeParams.id;
    },
    resolve: {
      loadMyCtrl: ['$route','$ocLazyLoad', function($route,$ocLazyLoad) {
        return $ocLazyLoad.load('assets/app/'+$route.current.params.controller+'.js');
      }]
    }
  })

  .otherwise({redirectTo:'/home'})

})

.controller('body', function($rootScope, $scope, minilib, $http, $localStorage, $location, $timeout) {
        $rootScope.$localStorage = $localStorage;
        $rootScope.$location = $location;
        $rootScope.apiUrl = apiUrl;
        $scope.isShowSidebar = false;

        $('.ui.sidebar').sidebar({
            transition: 'overlay',
            defaultTransition: {
                computer: {
                    left: 'overlay',
                    right: 'overlay',
                    top: 'overlay',
                    bottom: 'overlay'
                },
                mobile: {
                    left: 'overlay',
                    right: 'overlay',
                    top: 'overlay',
                    bottom: 'overlay'
                }
            }
        })

        $rootScope.keluar = function() {
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
            $('.ui.sidebar').sidebar('hide');
            $timeout(function() {
                $scope.isHold = false;
                $scope.isShow = false;
            }, 500)
            $location.path('masuk');
        }

        $scope.typeof = function(variable) {
            return typeof(variable)
        }

        $scope.parse = function(variable) {
            return Date.parse(variable)
        }

        $scope.objLengthMenu = function (obj, valSet = '') {
                let size = 0, key;
                //console.log('test repeat');
                for (value in Object.values(obj)) {
                    if (Object.values(obj)[value] == valSet && Object.keys(obj)[value] != 'add') size++;
                }
                return size;
        }

        $rootScope.holdMenu = function() {
            $scope.isHold = $scope.isHold ? false : true;
            $scope.isShow = $scope.isHold;
        }

        $rootScope.callListMenu = function() {
            minilib.get('menu/', {}, function(res) {
                if (res.status == 'success') {
                    $rootScope.listMenu = res.data;
                    $rootScope.listMenuAnak = res.data;
                }
            })
        }

        $rootScope.clickBack = function() {
            $location.path('dashboard');
        }

        $rootScope.toggleMenu = function(e) {
            if (!$scope.isShowSidebar && e.clientX < 2) {
                $scope.isShowSidebar = true;
                $('.ui.sidebar').sidebar({
                    transition: 'overlay',
                    dimPage: false
                }).sidebar('show');
            } else if ($scope.isShowSidebar && e.clientX > 260) {
                $scope.isShowSidebar = false;
                $('.ui.sidebar').sidebar({
                    transition: 'overlay',
                    dimPage: false
                }).sidebar('hide');
            }
        }

        $scope.addClear = function () {
            $timeout(function () {
                $('.optionclear').each(function() {
                    // console.log($(this));
                    $(this).find('i.dropdown.icon').after('<i class="remove icon"></i>');
                })
            }, 400)
        }
    })