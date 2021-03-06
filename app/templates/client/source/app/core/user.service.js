(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('userAPI', userSerivce);

    userSerivce.$inject = ['$http', '$q', '$rootScope', 'Event'];
    /* @ngInject */
    function userSerivce ($http, $q, $rootScope, Event) {
        var _isLoggedIn;
        var _userInfo;
        var service = {
            isLoggedIn: isLoggedIn,
            checkLoggedInStatus: checkLoggedInStatus,
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,
            getProductSummary: getProductSummary
        };

        return service;

        /////////////

        function isLoggedIn () {
            return _isLoggedIn;
        }

        function checkLoggedInStatus () {
            return $http.get('api/user/loginstatus', {ignoreLoadingBar: true})
                .then(success)
                .catch(fail);

            function success (response) {
                var data = response.data;
                if (response.status === 200 && data.code === 0) {
                    _setUser(data.result.user);
                    $rootScope.$broadcast(Event.AUTH_SESSION_VALID, data.result.user);
                    return data.result.user;
                } else {
                    _clearUser();
                    return $q.reject();
                }
            }

            function fail () {
                _clearUser();
                return $q.reject();
            }
        }

        function login (email, password) {
            var req = {
                email: email,
                password: password
            };
            return $http.post('api/user/login', req)
                .then(success)
                .catch(fail);

            function success (response) {
                var data = response.data;
                if (response.status === 200 && data.code === 0) {
                    _setUser(data.result.user);
                    $rootScope.$broadcast(Event.AUTH_LOGIN, data.result.user);
                    return data.result.user;
                } else {
                    _clearUser();
                    return $q.reject(data.message);
                }
            }

            function fail () {
                _clearUser();
                return $q.reject('$SERVER');
            }

        }

        function logout () {
            return $http.post('api/user/logout')
                .success(success)
                .error(fail);

            function success (response) {
                var data = response.data;
                _clearUser();
                if (response.status === 200 && data.code === 0) {
                    $rootScope.$broadcast(Event.AUTH_LOGOUT);
                    return;
                } else {
                    return $q.reject();
                }
            }

            function fail () {
                _clearUser();
                return $q.reject('$SERVER');
            }
        }

        function getUserInfo () {
            return _userInfo;
        }

        function getProductSummary () {
            return $http.get('api/user/products')
                .then(success)
                .catch(fail);

            function success (response) {
                var data = response.data;
                if (response.status === 200 && data.code === 0) {
                    return data.result.summary;
                } else {
                    return $q.reject(data.message);
                }
            }

            function fail () {
                return $q.reject('$SERVER');
            }
        }

        function _setUser (userData) {
            _isLoggedIn = true;
            _userInfo = userData;
        }

        function _clearUser () {
            _isLoggedIn = false;
            _userInfo = null;
        }

    }
})();
