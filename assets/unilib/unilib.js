'user strict';

function addComma(input) {
    var output = input
    if (parseFloat(input)) {
        input = new String(input);
        var parts = input.split(".");
        parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
        output = parts.join(".");
    }
    return output;
}

laapp.config(['$localStorageProvider', '$sessionStorageProvider',
        function($localStorageProvider, $sessionStorageProvider) {

            $localStorageProvider.setKeyPrefix('ye');
            $sessionStorageProvider.setKeyPrefix('ye');

        }
    ])
    .config(function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $locationProvider) {

        $routeProvider
            .when('/home', {
                templateUrl: 'ui/home/home.html',
                controller: 'home',
                resolve: {
                    loadMyCtrl: function($ocLazyLoad) {
                        return $ocLazyLoad.load('ui/home/home.js?v=' + Date.parse(new Date()));
                    }
                }
            })
            .when('/:file', {
                templateUrl: function($routeParams) {
                    var returnValue;
                            switch ($routeParams.file) {
                            case 'homex':
                                returnValue = 'ui/homex/homex.html'
                            break;
                            default:
                                returnValue = 'ui/mainui.html'
                            break;
                        };
                    return returnValue;
                },
                controller: function($routeParams, $controller, $scope) {
                    $controller($routeParams.file, {
                        $scope: $scope
                    });
                },
                resolve: {
                    loadMyCtrl: ['$route', '$ocLazyLoad', function($route, $ocLazyLoad) {
                        return $ocLazyLoad.load('ui/' + $route.current.params.file + '/' + $route.current.params.file + '.js?v=' + Date.parse(new Date()));
                    }]
                }
            })

            .when('/:file/:param1', {
                templateUrl: function($routeParams) {
                    return 'ui/' + $routeParams.file + '/' + $routeParams.file + '.html';
                },
                controller: function($routeParams, $controller, $scope) {
                    $controller($routeParams.file, {
                        $scope: $scope
                    });
                },
                resolve: {
                    loadMyCtrl: ['$route', '$ocLazyLoad', function($route, $ocLazyLoad) {
                        return $ocLazyLoad.load('ui/' + $route.current.params.file + '/' + $route.current.params.file + '.js?v=' + Date.parse(new Date()));
                    }]
                }
            })
            .when('/:file/:param1/:param2', {
                templateUrl: function($routeParams) {
                    return 'ui/' + $routeParams.file + '/' + $routeParams.file + '.html';
                },
                controller: function($routeParams, $controller, $scope) {
                    $controller($routeParams.file, {
                        $scope: $scope
                    });
                },
                resolve: {
                    loadMyCtrl: ['$route', '$ocLazyLoad', function($route, $ocLazyLoad) {
                        return $ocLazyLoad.load('ui/' + $route.current.params.file + '/' + $route.current.params.file + '.js?v=' + Date.parse(new Date()));
                    }]
                }
            })

        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode({
            enabled: true,

        });
    })

    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-text-container no-print"><div class="loading-text no-print">Memuat...</div></div>';
    }])

    .service('unilib', function($http, $resource, $rootScope, $location, $localStorage, Upload, $timeout) {

        this.ioTalkPrivate = function(u, d = {}) {
            Object.assign(d, {
                xusrid: u
            });
            socket.emit('private', d);
        }

        this.ioTalk = function(c, d = {}) {
            Object.assign(d, {
                xch: c
            });
            socket.emit('custom', d);
        }

        this.ioListen = function(c, d = function(res) {}) {
            socket.removeListener($localStorage.Client + '-' + c);
            socket.on($localStorage.Client + '-' + c, d);
        }

        this.notice = function(title, txt, onclick = function() {}) {
            if (Notification.permission == 'granted') {
                var options = {
                    body: txt,
                    icon: baseUrl + 'assets/img/icon.png',
                    sticky: true
                }
                var n = new Notification(title, options);
                setTimeout(n.close.bind(n), 5000);
            } else {
                Notification.requestPermission().then(function(result) {
                    console.log(result);
                });
            }
        }

        function customAlert (h, t = '') {
            $('.ui.customAlert').modal('show');
            $rootScope.customAlert = {
                header: h,
                content: t,
                yes: function() {
                }
            }
        }

        this.customAlert = function(h, t = '') {
            customAlert(h, t);
        }

        this.customConfirm = function(h, t, y = function() {}, n = function() {}) {
            $('.ui.customConfirm').modal('show');
            $rootScope.customConfirm = {
                header: h,
                content: t,
                yes: function() {
                    y();
                },
                no: function() {
                    n();
                }
            }
        }

        this.get = function(u, d, r = function() {}, i = true, rjson = true) {
            $http({
                    method: 'GET',
                    url: apiUrl + u,
                    ignoreLoadingBar: (!i),
                    params: d,

                })
                .then(function(res) {
                    if (rjson) {
                        let mydata = RJSON.unpack(res.data);
                        r(mydata);
                    } else {
                        r(res.data);
                    }
                }, function(err) {
                    switch (err.status) {
                        case (500) :
                            customAlert("Kesalahan", "Kesalahan pengolahan data, Mohon hubungi pihak Developer.");
                        break;
                        case (401) :
                            customAlert("Sesi Berakhir", "Sesi login anda telah berakhir, silakan login ulang.");
                            $rootScope.keluar();
                        break;
                    }
                })
        }

        this.post = function(u, d, r = function() {}, i = true, rjson = true) {
            $http({
                    transformRequest: function(data) {
                        return $.param(data);
                    },
                    method: 'POST',
                    ignoreLoadingBar: (!i),
                    url: apiUrl + u,
                    data: d
                })
                .then(function(res) {
                    let response = res.data;
                    r(response);
                }, function(err) {
                    switch (err.status) {
                        case (500) :
                            customAlert("Kesalahan", "Kesalahan pengolahan data, Mohon hubungi pihak Developer.");
                        break;
                        case (401) :
                            customAlert("Sesi Berakhir", "Sesi login anda telah berakhir, silakan login ulang.");
                            $rootScope.keluar();
                        break;
                    }
                })
        }

        this.put = function(u, d, r = function() {}, i = true, rjson = true) {
            $http({
                    transformRequest: function(data) {
                        return $.param(data);
                    },
                    method: 'PUT',
                    ignoreLoadingBar: (!i),
                    url: apiUrl + u,
                    data: d
                })
                .then(function(res) {
                    let response = res.data;
                    r(response);
                }, function(err) {
                    switch (err.status) {
                        case (500) :
                            customAlert("Kesalahan", "Kesalahan pengolahan data, Mohon hubungi pihak Developer.");
                        break;
                        case (401) :
                            customAlert("Sesi Berakhir", "Sesi login anda telah berakhir, silakan login ulang.");
                            $rootScope.keluar();
                        break;
                    }
                })
        }

        this.delete = function(u, d, r = function() {}, i = true, rjson = true) {
            u = u + Object.values(d).join('/');
            $http({
                    method: 'DELETE',
                    ignoreLoadingBar: (!i),
                    url: apiUrl + u
                })
                .then(function(res) {
                    let response = res.data;
                    r(response);
                }, function(err) {
                    switch (err.status) {
                        case (500) :
                            customAlert("Kesalahan", "Kesalahan pengolahan data, Mohon hubungi pihak Developer.");
                        break;
                        case (401) :
                            customAlert("Sesi Berakhir", "Sesi login anda telah berakhir, silakan login ulang.");
                            $rootScope.keluar();
                        break;
                    }
                })
        }

        this.getIndex = function(arr, val, key = '') {
            if (key == '') {
                var zzz = arr.indexOf(val);
            } else {
                var zzz = arr.findIndex(function(s) {
                    return s[key] == val;
                });
            }
            return zzz;
        }

        this.getObject = function(arr, val, key) {
            var zzz = arr.findIndex(function(s) {
                return s[key] == val;
            });
            return arr[zzz];
        }

        this.removeObject = function(arr, val, key) {
            var zzz = arr.findIndex(function(s) {
                return s[key] == val;
            });
            arr.splice(arr.indexOf(arr[zzz]), 1);
            return arr;
        }

        this.replaceObject = function(arr, val, key, newObj) {
            var zzz = arr.findIndex(function(s) {
                return s[key] == val;
            });
            arr[zzz] = newObj;
            return arr[zzz];
        }

        this.randId = function() {
            var myd = new Date();
            return MD5('TIPTECH_' + myd + localStorage.xFocusUserId);
        }

        this.clearHashkey = function(obj) {
            return JSON.parse(angular.toJson(obj));
        }

        this.filterArray = function(arr, val, key) {
            var arr_new = [];
            var regex = new RegExp(val, 'i');
            var zzz = arr.findIndex(function(s) {
                if (s[key].match(regex) !== null) {
                    arr_new.push(s);
                }
            });
            return arr_new;
        }

        this.parseTempArray = function (arr) {
            var collation = [];
            if (arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    delete arr[i]['a_id'];
                    let a = Object.values(JSON.parse(angular.toJson(arr[i])));
                    collation.push('('+a.join(',')+')');
                }
            }
            return collation.join(',');
        }

        this.autocomplete = function(u, d, t, r, mr = function(a) {
            return a;
        }) {
            var offline = (typeof(u) == 'object') ? true : false;
            var trg = 1;
            var key = '';
            if (detectmobile()) {
                $(document).on('textInput', 'input[ng-model="' + t + '"]', function(e) {
                    var keyCode = e.originalEvent.data.charCodeAt(0);
                    if (trg == 1) {
                        trg += 1;
                        d['key'] = '';
                        d['key'] = $('input[ng-model="' + t + '"]').val();
                        var self = $(this);
                        if ((keyCode == 13 || keyCode == 32 || keyCode == 9) && key != d['key']) {
                            $('input[ng-model="' + t + '"]').parent().find('.au').remove();
                            $('input[ng-model="' + t + '"]').after('<div class="au"></div>');
                            key = d['key'];
                            self.autocomplete({
                                source: function(request, response) {
                                    if (offline == true) {
                                        var arr_new = [];
                                        var regex = new RegExp(d['key'], 'i');
                                        var zzz = u.findIndex(function(s) {
                                            if ((s['value'].toString()).match(regex) != null) {
                                                arr_new.push(s);
                                            }
                                        });
                                        if (arr_new.length == 0) {
                                            var a = {};
                                            a['id'] = "";
                                            a['value'] = "Data tidak ditemukan.";
                                            arr_new.push(a);
                                        }
                                        $('input[ng-model="' + t + '"]').next().remove();
                                        response(arr_new);
                                    } else if (offline == false) {
                                        $.ajax({
                                                async: true,
                                                type: 'GET',
                                                url: baseUrl + u,
                                                data: d,
                                                cache: false
                                            })
                                            .then(function(res) {
                                                res = JSON.parse(res);
                                                res = mr(res);
                                                if (res.length == 0) {
                                                    var a = {};
                                                    a['id'] = "";
                                                    a['value'] = "Data tidak ditemukan.";
                                                    res.push(a);
                                                }
                                                $('input[ng-model="' + t + '"]').next().remove();
                                                response(res);
                                            })
                                    }
                                },
                                select: function(e, re) {
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
                $(document).on('keydown', 'input[ng-model="' + t + '"]', function(e) {
                    if (trg == 1) {
                        trg += 1;
                        d['key'] = '';
                        d['key'] = $('input[ng-model="' + t + '"]').val();
                        var self = $(this);
                        if ((e.keyCode == 13 || e.keyCode == 32) && key != d['key']) {
                            $('input[ng-model="' + t + '"]').parent().find('.au').remove();
                            $('input[ng-model="' + t + '"]').after('<div class="au"></div>');
                            key = d['key'];
                            self.autocomplete({
                                source: function(request, response) {
                                    if (offline == true) {
                                        var arr_new = [];
                                        var regex = new RegExp(d['key'], 'i');
                                        var zzz = u.findIndex(function(s) {
                                            if ((s['value'].toString()).match(regex) != null) {
                                                arr_new.push(s);
                                            }
                                        });
                                        if (arr_new.length == 0) {
                                            var a = {};
                                            a['id'] = "";
                                            a['value'] = "Data tidak ditemukan.";
                                            arr_new.push(a);
                                        }
                                        $('input[ng-model="' + t + '"]').next().remove();
                                        response(arr_new);
                                    } else if (offline == false) {
                                        $.ajax({
                                                async: true,
                                                type: 'GET',
                                                url: baseUrl + u,
                                                data: d,
                                                cache: false
                                            })
                                            .then(function(res) {
                                                res = JSON.parse(res);
                                                res = mr(res);
                                                if (res.length == 0) {
                                                    var a = {};
                                                    a['id'] = "";
                                                    a['value'] = "Data tidak ditemukan.";
                                                    res.push(a);
                                                }
                                                $('input[ng-model="' + t + '"]').next().remove();
                                                response(res);
                                            })
                                    }
                                },
                                select: function(e, re) {
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

        this.upload = function(u, d, r, p = function(evt) {
            console.log(evt)
        }, e = function(err) {
            console.log(err)
        }) {
            Upload.upload({
                url: apiUrl + u,
                data: d
            }).then(function(resp) {
                console.log(resp);
                r(resp.data);
            }, function(resp) {
                e(resp);
            }, function(evt) {
            });
        }

    })

    .run(function($rootScope, $route, $http, $location, $localStorage, unilib, $timeout) {
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            var publicPages = ['/masuk'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            // if (restrictedPage && !$localStorage.currentUser) {
            //     $location.path('/masuk');
            // } else {
            //     $rootScope.$on('$viewContentLoaded', function() {
            //         if (typeof($localStorage.currentUser) !== 'undefined' && typeof($rootScope.listMenu) !== 'undefined') {
            //             $rootScope.titleIcon = unilib.getObject($rootScope.listMenu, $route.current.params.file, 'menu_url')['menu_icon'];
            //         }
            //     });
            // }
        });
    })

    .directive('resize', function($window) {
        return function(scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function() {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;
                scope.style = function() {
                    return {
                        'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                    };
                };
            }, true);
            w.bind('resize', function() {
                scope.$apply();
            });
        }
    })

    .directive('ngEnter', function() {
        return function(scope, elem, attrs) {
            elem.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .directive('ngMax', ['$filter', function ($filter) {
      return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
          elem.on('input', function () {
            var max = parseFloat(attrs.ngMax);
            var val = parseFloat(elem.val().replace(/[^\d.-]/g,'')) > max ? max : elem.val().replace(/[^\d.-]/g,'') ;
            elem.val(val).trigger('change');
          })
        }
      };
    }])

    .directive('ngTgl', function($timeout) {
        return function(scope, elem, attrs) {
            var MonthListShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var tod = new Date();
            $timeout(function() {
                $(document).ready(function() {
                    elem.parent().parent().calendar({
                        type: 'date',
                        initialDate:null,
                        popupOptions: {
                            position: 'bottom left',
                            lastResort: 'bottom left',
                            prefer: 'opposite',
                            hideOnScroll: true
                        },
                        formatter: {
                            date: function(date, settings) {
                                if (!date) return '';
                                var day = date.getDate() + '';
                                if (day.length < 2) {
                                    day = '0' + day;
                                }
                                var month = (date.getMonth() + 1) + '';
                                if (month.length < 2) {
                                    month = '0' + month;
                                }
                                var monthShort = MonthListShort[date.getMonth()];
                                var year = date.getFullYear();
                                return day + ' ' + monthShort + ' ' + year;
                            }
                        },
                        onChange: function (date, text, mode) {
                            $timeout(function () {
                                elem.trigger('change');
                            });
                        }
                    });
                    if (elem.val() == '' || elem.val() == null) {
                        var date = new Date();
                        var day = tod.getDate() + '';
                        if (day.length < 2) {
                            day = '0' + day;
                        }
                        var month = (tod.getMonth() + 1) + '';
                        if (month.length < 2) {
                            month = '0' + month;
                        }
                        var monthShort = MonthListShort[tod.getMonth()];
                        var year = tod.getFullYear();
                        var defaults = day + ' ' + monthShort + ' ' + year;
                        elem.val(defaults).trigger('change');
                    }
                })
            })
        };
    })

    .directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {
                        $event: event
                    });
                });
            });
        };
    })

    .directive('ngAngka', function($timeout) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elem, attr, ctrl) {
                ctrl.$options.$$options.updateOn = 'input';
                $timeout(function() {
                    if (parseFloat(elem.val()) < 1 || isNaN(parseFloat(elem.val()))) {
                        elem.val(0).trigger('input');
                    } else {
                        elem.trigger('input');
                    }
                }, 1)
                elem.on('input change', function(e) {
                    var dec = attr.ngAngka == "" ? 0 : parseInt(attr.ngAngka);
                    var val = elem.val().replace(/[^\d.-]/g, '');
                    val = val.toString().match(/[.]/g) != null && val.toString().match(/[.]/g).length > 1 ? val.substring(0, val.length - 1) : val;
                    val = /[.]/g.test(val) ? val : parseFloat(val);
                    val = isNaN(val) ? 0 : val.toString();
                    val = ((val != '0.0' && val.substr(val.length - 1, 1) != '.') && val.substr(val.length - 2) != '.0') ? addComma(Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec)) : addComma(val);
                    elem.val(val);
                    ctrl.$parsers.push(function(val) { /* model */
                        return (val == '' || val == null) ? 0 : parseFloat(val.toString().replace(/[^\d.]/g, ''));
                    });
                    ctrl.$formatters.push(function(val) { /* view */
                        return (val == '' || val == null) ? 0 : addComma(val.toString().replace(/[^\d.]/g, ''));
                    });
                })
            }
        }
    })
    .directive('ngAngkaMin', function($timeout) {
        return {
            require: '?ngModel',
            link: function(scope, elem, attr, ctrl) {
                setTimeout(function() {
                    if (isNaN(parseFloat(elem.val()))) {
                        elem.val(0).trigger('input');
                    } else {
                        elem.trigger('input');
                    }
                }, 1)
                elem.on('input change focusout', function(e) {
                    scope.$apply();
                    var dec = attr.ngAngkaMin == "" ? 0 : parseInt(attr.ngAngkaMin);
                    var val = elem.val().replace(/[^\d.-]/g, '');
                    var isMin = ((val.match(/(-)/g) || []).length == 1) ? '-' : '';
                    val = ((val.match(/(-)/g) || []).length == 2) ? val.replace(/(-)/g, '') : val;
                    val = (/(-)/.test(val)) ? isMin + val.replace(/(-)/g, '') : val;
                    val = val.toString().match(/[.]/g) != null && val.toString().match(/[.]/g).length > 1 ? val.substring(0, val.length - 1) : val;
                    val = /[.]/g.test(val) ? val : parseFloat(val);
                    val = isNaN(val) ? 0 : val.toString();
                    val = ((val != '0.0' && val.substr(val.length - 1, 1) != '.') && val.substr(val.length - 2) != '.0') ? addComma(Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec)) : addComma(val);
                    elem.val(isMin + addComma(val.toString().replace(/[^\d.]/g, '')));
                    ctrl.$parsers.push(function(val) { /* model */
                        return (val == '' || val == null) ? 0 : parseFloat(val.toString().replace(/[^\d.-]/g, ''));
                    });
                    ctrl.$formatters.push(function(val) { /* view */
                        return (val == '' || val == null) ? 0 : isMin + addComma(val.toString().replace(/[^\d.-]/g, ''));
                    });
                })
            }
        }
    })
    .directive('ngPersen', ['$filter', function ($filter) {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attr, ctrl) {
          elem.on('input change', function (e) {
            elem.val(elem.val().replace(/[^0-9\%\+\s]/g,''));
          });
        }
      }
    }])

    .filter("ucwords", function() {
        return function(input) {
            if (input) {
                input = input.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                    return letter.toUpperCase();
                });
            }
            return input;
        }
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

$(document).ready(function() {

    $(document).on('click', '.remove.icon', function(e) {
        $(this).parent('.dropdown').dropdown('clear');
        e.stopPropagation();
    });

    $(document).on('click', '#btn_csv', function() {
        var url_export = $(this).attr('link-template');
        $.confirm({
            title: 'PERTANYAAN',
            content: 'Apakah Anda Ingin Mengimport File CSV atau Mengexport Template CSV ?',
            animation: 'rotateXR',
            useBootstrap: false,
            boxWidth: '40%',
            buttons: {
                batal: {
                    text: 'Batal',
                    btnClass: 'ui red button',
                    keys: ['enter', 'shift'],
                    action: function() {
                        return true;
                    }
                },
                exportTemplateCsv: {
                    text: 'Export Template CSV',
                    btnClass: 'ui yellow button',
                    keys: ['enter', 'shift'],
                    action: function() {
                        document.location.href = url_export;
                    }
                },
                importCsv: {
                    text: 'Import CSV',
                    btnClass: 'ui green button',
                    keys: ['enter', 'shift'],
                    action: function() {
                        $('#btnUpload').trigger('click');
                    }
                }
            }
        })
    })
})

function focus(ngModel, delay = 700) {
    setTimeout(function() {
        $('[ng-model="' + ngModel + '"]').focus().trigger('click');
    }, delay)
}
