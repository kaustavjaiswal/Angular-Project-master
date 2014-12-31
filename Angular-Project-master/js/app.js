angular.module('weather', ['ngAnimate'])

.factory('openweather', function($http) {
    var runRequest = function(city) {
        return $http({
            method: 'JSONP',
            url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&mode=json&units=metric&cnt=5&callback=JSON_CALLBACK'
        });
    };
    return {
        event: function(city) {
            return runRequest(city);
        }
    };
})

.controller('WeatherForecastCtrl', function($scope, $timeout, openweather) {
    var timeout;
    $scope.resultsData = false;
    $scope.$watch('city', function(newCity) {
        if (newCity) {
            $('#entry').spin('small', 'red');
            if (timeout) $timeout.cancel(timeout);
            timeout = $timeout(function() {
                openweather.event(newCity).success(function(data, status) {
                    $scope.loc = data;
                    $scope.forecast = data.list;
                    console.log($scope.condition);
                    $scope.resultsData = false;
                    $('#entry').spin(false);
                    weatherChange($scope.forecast[0].weather[0].main)
                });
                openweather.event(newCity).error(function() {
                    $scope.resultsData = true;
                    $scope.loc = null;
                    $scope.forecast = null;
                    $('#entry').spin(false);

                });
            }, 3000);
        }
    });
    $scope.direction = 'left';
    $scope.currentIndex = 0;

    $scope.setCurrentSlideIndex = function(index) {
        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
        $scope.currentIndex = index;
    };

    $scope.isCurrentSlideIndex = function(index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function() {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < 5 - 1) ? ++$scope.currentIndex : 0;
        weatherChange($scope.forecast[$scope.currentIndex].weather[0].main)

    };

    $scope.nextSlide = function() {
        $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : 5 - 1;
        weatherChange($scope.forecast[$scope.currentIndex].weather[0].main)
    };
})

.animation('.slide-animation', function() {
    return {
        addClass: function(element, className, done) {
            if (className == 'ng-hide') {
                TweenMax.to(element, 0.5, {
                    left: -element.parent().width(),
                    onComplete: done,
                    css: {
                        scale: .05,
                        opacity: 0,
                        rotation: 180
                    },
                    ease: Quad.easeInOut
                });
            } else {
                done();
            }
        },
        removeClass: function(element, className, done) {
            if (className == 'ng-hide') {
                element.removeClass('ng-hide');
                TweenMax.to(element, 1, {
                    left: 0,
                    onComplete: done,
                    css: {
                        scale: 1,
                        opacity: 1,
                        rotation: 360
                    },
                    ease: Quad.easeOut
                });
            } else {
                done();
            }
        }
    };
});

function weatherChange(weatherCondition) {
    var imageHolder = $('#bg');
    if (weatherCondition === 'Clear') {
        imageHolder.fadeOut(1000, function() {
            imageHolder.attr("src", "./images/weatherClear.jpg");
            imageHolder.fadeIn(1000);
        });
        $('.slide-animation').removeClass('allWhite');
        $('.slide-animation').addClass('allBlack');
        $('.weatherHeader').removeClass('allWhite');
        $('.weatherHeader').addClass('allBlack');
    }
    if (weatherCondition === 'Clouds') {
        imageHolder.fadeOut(1000, function() {
            imageHolder.attr("src", "./images/weatherClouds.jpg");
            imageHolder.fadeIn(1000);
        });
        $('.slide-animation').removeClass('allBlack');
        $('.slide-animation').addClass('allWhite');
        $('.weatherHeader').removeClass('allBlack');
        $('.weatherHeader').addClass('allWhite');

    }
    if (weatherCondition === 'Rain') {
        imageHolder.fadeOut(1000, function() {
            imageHolder.attr("src", "./images/weatherRain.jpg");
            imageHolder.fadeIn(1000);
        });
        $('.slide-animation').removeClass('allBlack');
        $('.slide-animation').addClass('allWhite');
        $('.weatherHeader').removeClass('allBlack');
        $('.weatherHeader').addClass('allWhite');
    }
    // if(weatherCondition==clear)
    // {

    // }
    // if(weatherCondition==clear)
    // {

    // }
    // if(weatherCondition==clear)
    // {

    // }
    // if(weatherCondition==clear)
    // {

    // }
}