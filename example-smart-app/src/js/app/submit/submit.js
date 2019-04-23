(function (app)
{
    'use strict';

    submitController.$inject = ['dataService', '$scope'];

    function submitController(dataService, $scope)
    {
        var self = this;

        //self.data = "";
        self.canSubmit = false;

        self.submit = function ()
        {
            if (self.canSubmit == true)
            {

            }
        }

        self.$onInit = function ()
        {
            $scope.$watch(function ()
            {
                return dataService.summary;
            },
                function (newVal, oldVal)
                {
                    if (dataService.isValid(dataService.error) == false && // check there are no errors in dataService
                        dataService.isValid(dataService.summary) &&
                        dataService.allApproved() == true)
                    {
                        self.canSubmit = true;
                    }
                    else if (self.canSubmit == true)
                    {
                        self.canSubmit = false;
                    }
                });
        }
    }

    app.component('submit', {
        templateUrl: function ()
        {
            return "./src/js/app/submit/submit.html";
        },
        controller: submitController,
    });

})(angular.module(constants.appName));
