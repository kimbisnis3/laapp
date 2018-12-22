<!doctype html>
<html ng-app="laapp" ng-right-click="$event.preventDefault()">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <base href="/la/" />
    <title ng-bind="title"></title>

    <link rel="stylesheet" href="assets/semantic/semantic.min.css">
    <link rel="stylesheet" href="assets/loadingbar/loading-bar.min.css">
    <link rel="stylesheet" href="assets/icon/css/all.min.css">
    <!-- <link rel="stylesheet" href="assets/customcss/custom.css"> -->
    <!-- <link rel="stylesheet" href="assets/customcss/fontface_poppins.css"> -->
    <link rel="stylesheet" href="assets/animate/animate.min.css">
    <link rel="stylesheet" href="assets/semantic-ui-calendar/calendar.min.css" />
    <link rel="text/html" href="assets/angular-csp.css">

    <script type="text/javascript" src="assets/lodash/lodash.js"></script>

    <script type="text/javascript" src="assets/jquery/jquery-3.3.1.min.js"></script>

    <script type="text/javascript" src="assets/angularjs/angular.min.js"></script>
    <script type="text/javascript" src="assets/angularjs/angular-resource.min.js"></script>
    <script type="text/javascript" src="assets/angularjs/angular-route.min.js"></script>
    <script type="text/javascript" src="assets/angularjs/angular-animate.min.js"></script>
    <script type="text/javascript" src="assets/angularjs/angular-sanitize.min.js"></script>

    <script type="text/javascript" src="assets/oclazyload/ocLazyLoad.min.js"></script>
    <script type="text/javascript" src="assets/ngstorage/ngStorage.min.js"></script>

    <script type="text/javascript" src="assets/upload/ng-file-upload-shim.min.js"></script>
    <script type="text/javascript" src="assets/upload/ng-file-upload.min.js"></script>

    <script type="text/javascript" src="assets/semantic/semantic.min.js"></script>
    <script type="text/javascript" src="assets/angular-semantic-ui/angular-semantic-ui.min.js"></script>

    <script type="text/javascript" src="assets/loadingbar/loading-bar.min.js"></script>
    <script type="text/javascript" src="assets/rjson/rjson.js"></script>
    <script type="text/javascript" src="assets/semantic-ui-calendar/calendar.min.js"></script>
    <script type="text/javascript" src="assets/dragdrop/angular-drag-and-drop-lists.min.js"></script>


    <script>
        var appUrl = "http://localhost/la/";
        var laapp = angular.module('laapp', ['ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate', 'oc.lazyLoad', 'angular-loading-bar', 'ngStorage', 'ngFileUpload', 'semantic-ui', 'dndLists']);
        var app = angular.module('app',['ngRoute'])
    </script>
    <script type="text/javascript" src="assets/unilib/unilib.js"></script>
</head>

<body>
<div class="ui small menu">
  <a class="active item">
    Home
  </a>
  <a class="item">
    Messages
  </a>
  <div class="right menu">
    <div class="ui dropdown item">
      Language <i class="dropdown icon"></i>
      <div class="menu">
        <a class="item">English</a>
        <a class="item">Russian</a>
        <a class="item">Spanish</a>
      </div>
    </div>
    <div class="item">
        <div class="ui primary button">Sign Up</div>
    </div>
  </div>
</div>
  <div class="ui sidebar inverted vertical menu">
    <a class="item">
      Menu 1
    </a>
  </div>
  <div class="pusher">
    
  </div>
</body>

</html>
