// jshint esversion:6
var App = angular.module('BiBiApp',['ngRoute','ngAnimate','ngMaterial','ngMessages']);
App.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
App.controller('RootCtrl',['$scope','$rootScope','$location','$http','$timeout','$anchorScroll','$mdDialog','$mdMedia',function($scope,$rootScope,$location,$http,$timeout,$anchorScroll,$mdDialog,$mdMedia){
  $scope.getHeader = function() {
    var name = $location.url();
    var ctrlName = (name ? name[0].toUpperCase() + name.slice(1) : "main" ) ;
    if (ctrlName.indexOf('profile') != -1) return false;
    return 'views/headers/'+name+'.html';
  };

  $scope.user = {
    avatar : 'images/profile-photo.png',
    firstName : "Алексей",
    lastName : "Акиньшин",
    middleName : "Игоревич",
    phone : '+7 (919) 234-58-64',
    mail : 'aleksey.sys.ak@gmail.com'
  };

  $scope.$on('$locationChangeSuccess', function(event,next,current) {
      $anchorScroll();
  });

  $scope.prevent = function(evt) {
    evt.stopPropagation();
  };
  $scope.openAuth = function() {
    $scope.$broadcast('showAuth');
  };
}]);

App.controller('MainCtrl',['$scope','$rootScope','$timeout',function($scope,$rootScope,$timeout){
  $scope.$on('showAuth',function() {
      $scope.showAuthorize = true;
  });
  $scope.hideAuth = function() {
      $scope.showAuthorize = false;
  };
}]);

App.controller('MeCtrl',['$scope','$rootScope','$timeout','$routeParams','$location',function($scope,$rootScope,$timeout,$routeParams,$location){
  $scope.initMe = function() {

  };
  $scope.getSection = function() {
    var section = $routeParams.section || "main";
    return 'views/sections/me-'+section+'.html';//?decache='+Math.random();
  };
  $scope.currentSection = function() {
    var current = $routeParams.section || "main";
    return $scope.menu.filter(function(link) {
      return link.href.indexOf(current) != -1;
    })[0];
  };
  $scope.addCompany = function() {
    $location.url('reg');
  };
  $scope.points = [
    {
      name : 'LR-Premium',
      logo : 'images/logo.png',
      desc : 'Сертифицированный сервис для вашего Land Rover в Москве. Комплексная диагностика в подарок при первом посещении.',
    },
    {
      name : 'Porsche Family',
      logo : 'images/logo.png',
      desc : 'Сертифицированный сервис для вашего Porsche в Москве. Комплексная диагностика в подарок при первом посещении.',
    }
  ];
  $scope.menu = [
    {
      href:'#/me/main',
      name:'Редактировать профиль',
      marker: 'images/pointer.svg',
      action: function() {$scope.showProfileChange = true;}
    },
    {
      href:'#/me/password',
      name:'Изменить пароль',
      marker: 'images/car.svg',
      action: function() {$scope.showPasswordChange = true;}
    },
    {
      href:'#/me/email',
      name:'Изменить e-mail',
      marker: 'images/calendar.svg',
      action: function() {$scope.showMailChange = true;}
    }
  ];
}]);

App.controller('ProfileCtrl',['$scope','$rootScope','$timeout','$routeParams',function($scope,$rootScope,$timeout,$routeParams){
  $scope.initProfile = function() {
    $('.header.slogan').hide();
    $.get('/data/markBlocks.json')
    .done(function(data){
      $scope.markBlocks = data;
    });
    $.get('/data/workTypes.json')
    .done(function(data){
      $scope.workBlocks = data;
    });
    $.get('/data/otherTypes.json')
    .done(function(data){
      $scope.other = data;
    });
  };
  $scope.logo = 'images/logo.png';
  $scope.status = true;
  $scope.getSection = function() {
    var section = $routeParams.section || "main";
    return 'views/sections/profile-'+section+'.html';//?decache='+Math.random();
  };
  $scope.isActive = function(href) {
    var address = href.split('/').splice(-1),
        current = $routeParams.section || "main";
    return (address == current ? 'active' : '');
  };
  $scope.menu = [
    {
      href:'#/profile/main',
      name:'Профиль',
      marker: 'images/pointer.svg'
    },
    {
      href:'#/profile/contacts',
      name:'Контакты и реквизиты',
      marker: 'images/pointer.svg'
    },
    {
      href:'#/profile/vendors',
      name:'Марки и услуги',
      marker: 'images/car.svg'
    },
    {
      href:'#/profile/employees',
      name:'Сотрудники и график',
      marker: 'images/calendar.svg'
    },
    {
      href:'#/profile/photo',
      name:'Фото и видео',
      marker: 'images/photo.svg'
    },
    {
      href:'#/profile/sales',
      name:'Акции и спецпредложения',
      marker: 'images/actions.svg'
    },
    {
      href:'#/profile/settings',
      name:'Настройки отображения',
      marker: 'images/gears.svg'
    },
  ];
  $scope.currentSection = function() {
    var current = $routeParams.section || "contacts";
    return $scope.menu.filter(function(link) {
      return link.href.indexOf(current) != -1;
    })[0];
  };
  $scope.checkBlocks = function(blocks) {
    blocks.forEach(function(i) {
      i.items.forEach(function(j){
        j.status = !blocks.checked;
      });
    });
  };
  $scope.getChecked = function(block) {
    var count = 0;
    block.items.forEach(function(x){
      if (x.status) count++;
    });
    return count;
  };
  $scope.checkAll = function(block) {
    var count = 0;
    block.items.forEach(function(x){
      x.status = !block.checked;
    });
  };
  $scope.countChecked = function(blocks) {
    var count = 0;
    blocks.forEach(function(i) {
      i.items.forEach(function(j){
        if (j.status) count++;
      });
    });
    return count;
  };
  $scope.countTotal = function(blocks) {
    var count = 0;
    blocks.forEach(function(i) {
      count += i.items.length;
    });
    return count;
  };
}]);

App.controller('RegCtrl',['$scope','$rootScope','$timeout',function($scope,$rootScope,$timeout){

}]);

var dirs = [
  'reg','main','profile','me'
];
App.config(['$routeProvider',function($routeProvider) {
  dirs.forEach(function(name) {
    var ctrlName = name[0].toUpperCase() + name.slice(1);
    $routeProvider.when('/'+name,{
      templateUrl: 'views/'+name+'.html',
      controller: ctrlName+'Ctrl'
    });
  });
  $routeProvider.when('/profile/:section',{
    templateUrl: 'views/profile.html',
    controller: 'ProfileCtrl'
  });
  $routeProvider.when('/me/:section',{
    templateUrl: 'views/me.html',
    controller: 'MeCtrl'
  });
  $routeProvider.otherwise({redirectTo:'/main'});
}]);
