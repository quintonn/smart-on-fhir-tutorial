(function (app)
{
    'use strict';

    DataMenuController.$inject = ['dataService', '$scope'];

    function DataMenuController(dataService, $scope)
    {
        var self = this;

        //self.test = function ()
        //{
        //    return dataService.test;
        //}

        //setTimeout(function ()
        //{
        //    dataService.test = "jsdklfj";
        //    $scope.$apply();
        //}, 3000);
    }

    app.component('discharge', {
        templateUrl: function ()
        {
            return "./src/js/app/discharge/discharge.html";
        },
        controller: DataMenuController,
    });

})(angular.module(constants.appName));
