(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['userAPI', '$state', 'ajaxErrorHanlder', '$timeout'];
    /* @ngInject */
    function LoginController (userAPI, $state, ajaxErrorHanlder, $timeout) {
        var vm = this;

        vm.login = login;

        var _routeAfterLogin = 'root.dashboard';

        init();

        ////////////

        function init () {
            // handle logout
            var action = $state.params.action;
            if (action === 'logout') {
                vm.needCheckLogin = false;
                userAPI.logout()
                    .then(function () {
                        _setError('success', 'You have been successfully logged out!');
                    });
            } else {
                vm.userInfo = null;
                vm.needCheckLogin = true;
                // check login status firstly
                userAPI.checkLoggedInStatus()
                    .then(function (data) {
                        vm.userInfo = data;
                        $timeout(function () {
                            $state.go(_routeAfterLogin);
                        }, 1000);
                    })
                    .catch(function () {
                        vm.needCheckLogin = false;
                    });
            }
        }

        function login (credential) {
            if (vm.loginForm.$invalid) {
                return;
            }
            vm.isRequest = true;
            userAPI.login(credential.email, credential.password)
                .then(success)
                .catch(error);

            function success (data) {
                vm.loginError = null;
                // user was redirect to login page
                if ($state.prev) {
                    $state.go($state.prev.state, $state.prev.params);
                    $state.prev = null;
                } else {
                    $state.go(_routeAfterLogin);
                }
            }

            function error (reason) {
                var message = ajaxErrorHanlder.getMessage(reason);
                _setError('error', message);
                vm.isRequest = false;
            }
        }

        function _setError (type, text) {
            vm.loginError = {
                type: type,
                text: text
            };
        }
    }
})();
