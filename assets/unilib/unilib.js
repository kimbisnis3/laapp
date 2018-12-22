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

.controller('body', function($rootScope, $scope, unilib, $http, $localStorage, $location, $timeout) {
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
            unilib.get('menu/', {}, function(res) {
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

.service('unilib', function ($http,$resource,$rootScope,$location, $route, $localStorage) {
  this.get = function (u,d,r) {
    $http({
      method  : 'GET',
      url     : base_url+u,
      params  : d
    })
    .then(function (res) {
      r(res.data);
    },function(err) {
      console.log(err.data);
    })

  }
  this.post = function (u,d,r) {
    $http({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      transformRequest : function(data){
        return $.param(data);
      },
      method  : 'POST',
      url     : base_url+u,
      data    : d
    })
    .then(function (res) {
      r(res.data);
    },function(err) {
       console.log(err.data);
    })
  }
  this.confirm = function (t,y,n) {
    $.confirm({
      icon: 'fa fa-warning',
      title: 'HAPUS DATA',
      content: 'Anda Yakin Akan Menghapus Data '+t+' ?',
      animation: 'rotateXR',
      buttons: {
        batal: {
          text: 'Batal',
          btnClass: 'btn-default',
          keys: ['enter', 'shift'],
          action: n
        },
        ok: {
          text: 'OK',
          btnClass: 'btn-success',
          keys: ['enter', 'shift'],
          action: y
        }
      }
    })
  }
  this.custom_confirm = function (h,t,y,n) {
    $.confirm({
      icon: 'fa fa-warning',
      title: h,
      content: t,
      buttons: {
        batal: {
          text: 'Batal',
          btnClass: 'btn-default',
          keys: ['enter', 'shift'],
          action: function () {
            $rootScope.$apply(n);
          }
        },
        ok: {
          text: 'OK',
          btnClass: 'btn-success',
          keys: ['enter', 'shift'],
          action: function () {
            $rootScope.$apply(y);
          }
        }
      }
    })
  }
 this.autocomplete = function(u,d,t,r,mr=function(a){ return a; }) {
    var trg = 1;
    var key = '';
    if (detectmobile()) {
      $(document).on('textInput', 'input[ng-model="'+t+'"]', function (e) {
        var keyCode = e.originalEvent.data.charCodeAt(0);
        if (trg == 1) {
          trg += 1;
        d['key'] = '';
        d['key'] = $('input[ng-model="'+t+'"]').val();
        var self = $(this);
        if ((keyCode == 13 || keyCode == 32 || keyCode == 9) && key != d['key']) {
          $('input[ng-model="'+t+'"]').parent().find('.au').remove();
          $('input[ng-model="'+t+'"]').after('<div class="au"></div>');
          key = d['key'];
          self.autocomplete({
            source : function (request, response) {
                $.ajax({
                  type    : 'GET',
                  url     : base_url+u,
                  data    : d,
                  cache   : false
                })
                .then(function (res) {
                  res = JSON.parse(res);
                  res = mr(res);
                  if (res.length == 0) {
                    var a = {};
                    a['id'] = "";
                    a['value'] = "Data tidak ditemukan.";
                    res.push(a);
                  }
                  $('input[ng-model="'+t+'"]').next().remove();
                  response(res);
                })
            },
            select: function (e, re) {
              $rootScope.$apply(r(re.item));
              e.keyCode = '';
            }
          })
          if ((keyCode == 13 || keyCode == 32 || keyCode == 9) && self.autocomplete('close')) {
            self.trigger('input');
          }
        } else {
          if (self.autocomplete().length >= 1) {
            self.autocomplete('destroy');
          }
        }
      }
      })
    } else {
      $(document).on('keydown', 'input[ng-model="'+t+'"]', function (e) {
        if (trg == 1) {
          trg += 1;
        d['key'] = '';
        d['key'] = $('input[ng-model="'+t+'"]').val();
        var self = $(this);
        if ((e.keyCode == 13 || e.keyCode == 32) && key != d['key']) {
          $('input[ng-model="'+t+'"]').parent().find('.au').remove();
          $('input[ng-model="'+t+'"]').after('<div class="au"></div>');
          key = d['key'];
          self.autocomplete({
            source : function (request, response) {
                $.ajax({
                  type    : 'GET',
                  url     : base_url+u,
                  data    : d,
                  cache   : false
                })
                .then(function (res) {
                  res = JSON.parse(res);
                  res = mr(res);
                  if (res.length == 0) {
                    var a = {};
                    a['id'] = "";
                    a['value'] = "Data tidak ditemukan.";
                    res.push(a);
                  }
                  $('input[ng-model="'+t+'"]').next().remove();
                  response(res);
                })
            },
            select: function (e, re) {
              $rootScope.$apply(r(re.item));
              e.keyCode = '';
            }
          })
          if ((e.keyCode == 13 || e.keyCode == 32) && self.autocomplete('close')) {
            self.trigger('input');
          }
        } else {
          if (self.autocomplete().length >= 1) {
            self.autocomplete('destroy');
          }
        }
      }
    })
    }
  }
  this.upload = function (u,f,r) {
    $(f).on('submit', function(){
      var formData = new FormData(this);
      $.ajax({
        type:'POST',
        url: base_url+u,
        data:formData,
        cache:false,
        contentType: false,
        processData: false,
        success:function(res){
          res = JSON.parse(res);
          r(res);
        }
      });
    });
  }
  this.get_object = function (arr, key, val) {
    var zzz = arr.findIndex(function (s){
        return s[key] == val;
    });
    return arr[zzz];
  }
  this.get_index = function (arr, key, val) {
    var obj = arr.findIndex(function (s){
        return s[key] == val;
    });
    var o = angular.toJson(obj);
    return JSON.parse(o);
  }
  this.clear_hashkey = function (obj) {
    var o = angular.toJson(obj);
    return JSON.parse(o);
  }
  this.alert_label = function (is, mdl, txt="") {
    if (is) {
      $('input[ng-model="'+mdl+'"]').parent().prepend('<b class="float-right noticer" style="color:red">'+txt+'</b>');
    } else {
      $('input[ng-model="'+mdl+'"]').parent().find('b.noticer').slideUp()
    }
  }
  this.custom_alert = function (h,t) {
    $.alert({
      title: h,
      content: t,
      confirmButton: 'OK'
    })
  }
  this.check_edit = function (urlcheck,id,e,urltujuan="",resp) {
    e.preventDefault();
    console.log($route.current.params.controller);
    if($rootScope.$storage.edit_now != '' && $rootScope.$storage.edit_now != null){
          $.alert({
            title: "PERINGATAN!",
            content: "Apakah anda ingin menyelesaikan editan sebelumnya? <a class='linker mmb-fc-red' href='#"+$rootScope.$storage.edit_now+"'>Klik disini jika Ya</a>",
            confirmButton: 'OK'
          })
    }else{
      this.get(urlcheck,{'id':id}, function (res) {
        if (res.edited == 1) {
          $.alert({
            title: "PERINGATAN!",
            content: res.msg,
            confirmButton: 'OK'
          })
          return false;
        }else {
          $route.current.params.controller == 'pricelist'?$localStorage.edit_now = urltujuan : '';

          if(urltujuan!=""){

            $location.path(urltujuan);
          }
          else {
            resp(1);
          }
        }
      });
    }

  }
})