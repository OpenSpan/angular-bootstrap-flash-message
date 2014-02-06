angular.module('flash', [])
.factory('flash', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  var messages = {};
  var counter = 1;

  var reset;
  var cleanup = function(zone) {
    $timeout.cancel(reset);
    reset = $timeout(function() { delete messages[zone]; });
  };

  var emit = function() {
    $rootScope.$emit('flash:message', messages, cleanup);
  };

  $rootScope.$on('$locationChangeSuccess', emit);

  pushFlash = function(text, level, seconds, zone, retryCallback) {
    var icon;
    var tagline;
    switch(level) {
      case 'success':
        icon = "icon-ok-circle";
        tagline = 'Success';
        break;
      case 'warning':
        icon = "icon-exclamation-sign";
        tagline = 'Warning';
        break;
      case 'danger':
        icon = "icon-remove";
        tagline = 'Error';
        break;
    }

    messages[zone] = {
      'text': text,
      'level': level,
      'icon': icon,
      'tagline': tagline,
      'seconds': seconds,
      'reference': counter++,
      'retryCallback': retryCallback
    };
    emit();
  };

  var flash = {}
  angular.forEach(['danger', 'warning', 'info', 'success'], function(level) {
    flash[level] = function(options) {
      pushFlash(
        options.text,
        level,
        options.seconds || false,
        options.zone,
        options.retryCallback || false
      );
    }
  });

  return flash;
}])

.directive('flashMessages', [function() {
  var directive = { restrict: 'A', replace: true, scope: { "zone": "@" } };
  directive.template =
    '<div id="flash-message-{{m.reference}}" class="alert alert-{{m.level}}">' +
      '<icon ng-if="m.icon" class="icon-{{ m.icon }}">&nbsp;</icon>'+
      '<strong ng-if="m.tagline">{{ m.tagline }}:&nbsp;</strong>' +
      '{{ m.text }} ' +
      '<a ng-if="m.retryCallback" href="javascript:void(0);" ng-click="m.retryCallback">Retry</a>' +
      '<button type="button" class="close" ng-click="closeFlash(m.reference)" aria-hidden="true">&times;</button>' +
    '</div>';

  directive.controller = ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    $scope.closeFlash = function(ref) {
      angular.element("#flash-message-"+ref).remove();
    }
    $rootScope.$on('flash:message', function(_, messages, done) {
      if(messages[$scope.zone]) {
        $scope.m = message = messages[$scope.zone];
        if(message.seconds) {
          $timeout(
            function() { $scope.closeFlash(message.reference); },
            message.seconds * 1000
          );
        }
        done($scope.zone);
      }
    });
  }];

  return directive;
}]);
