(function (app)
{
    'use strict';

    DataMenuController.$inject = ['dataService', '$scope'];

    function DataMenuController(dataService, $scope)
    {
        var self = this;

        self.menu = [];
        self.menu.push({ id: "patient", name: "Patient Demographics" });
        self.menu.push({ id: "gp", name: "GP Practice" });
        self.menu.push({ id: "diagnosis", name: "Diagnoses" });
        self.menu.push({ id: "summary", name: "Clinical Summary" });

        self.menu.push({ id: "medications", name: "Medications & Medical Devices" });
        self.menu.push({ id: "allergies", name: "Allergies & Adverse Reactions" });
        
        self.activeMenu = self.menu[0].id;

        self.selectMenu = function (menu)
        {
            self.activeMenu = menu.id;
        }

        self.isValid = function(menu)
        {
            var result = dataService.sectionApproved.indexOf(menu.id) != -1;
            return result;
        }

        self.validSummary = false;
        self.validAllergies = false;
        self.validPatient = false;

        self.$onInit = function ()
        {
            $scope.$watch(function ()
            {
                return dataService.sectionApproved;
            },
                function (newVal, oldVal)
                {
                    //self.validAllergies = newVal;
                    console.log(newVal);
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
