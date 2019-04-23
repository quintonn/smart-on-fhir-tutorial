(function (app)
{
    'use strict';

    clinicalSummaryController.$inject = ['dataService', '$scope'];

    function clinicalSummaryController(dataService, $scope)
    {
        var self = this;

        self.summary = "";

        self.$onInit = function ()
        {
            $scope.$watch(function ()
            {
                return self.summary;
            },
            function (newVal, oldVal)
            {
                dataService.summary = newVal;
            });
        }

        setTimeout(function ()
        {
            $scope.$apply();
        }, 10000);
    }

    app.component('clinicalSummary', {
        templateUrl: function ()
        {
            return "./src/js/app/clinicalSummary/clinicalSummary.html";
        },
        controller: clinicalSummaryController,
    });

})(angular.module(constants.appName));
