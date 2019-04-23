(function (app)
{
    'use strict';

    DataMenuController.$inject = ['dataService'];

    function DataMenuController(dataService)
    {
        var self = this;
        console.log('x');
    }

    app.component('discharge', {
        templateUrl: function ()
        {
            return "./src/js/app/discharge/discharge.html";
        },
        controller: DataMenuController,
    });

})(angular.module(constants.appName));
