(function (app)
{
    'use strict';

    DataMenuController.$inject = ['dataService', '$scope'];

    function DataMenuController(dataService, $scope)
    {
        var self = this;

        self.validSummary = false;
        self.validAllergies = false;
        self.validPatient = false;

        self.$onInit = function ()
        {
            $scope.$watch(function ()
            {
                return dataService.allergiesApproved;
            },
                function (newVal, oldVal)
                {
                    self.validAllergies = newVal;
                });

            $scope.$watch(function ()
            {
                return dataService.patientApproved;
            },
                function (newVal, oldVal)
                {
                    self.validPatient = newVal;
                });

            $scope.$watch(function ()
            {
                return dataService.summary;
            },
                function (newVal, oldVal)
                {
                    if (dataService.isValid("") == false && // check there are no errors in dataService
                        dataService.isValid(dataService.summary))
                    {
                        console.log('valid = true');
                        self.validSummary = true;
                    }
                    else if (self.validSummary == true)
                    {
                        self.validSummary = false;
                    }
                });
        }
    }

    app.component('discharge', {
        templateUrl: function ()
        {
            return "./src/js/app/discharge/discharge.html";
        },
        controller: DataMenuController,
    });

})(angular.module(constants.appName));
