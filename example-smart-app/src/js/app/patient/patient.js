﻿(function (app)
{
    'use strict';

    PatientController.$inject = ['$scope', 'dataService'];

    function PatientController($scope, dataService)
    {
        var self = this;
        self.loading = false;
        self.ready = false;
        self.error = "";

        self.firstName = "";
        self.lastName = "";
        self.gender = "";
        self.birthDate = '';
        self.deathDate = '';

        function loadData()
        {
            self.loading = true;
            dataService.getPatientData().then(function (data)
            {
                console.log(data);
                self.gender = data.gender;
                self.firstName = data.name[0].given.join(' ');
                self.lastName = data.name[0].family.join(' ');
                self.birthDate = data.birthDate;

                self.ready = true;
            }).catch(function (err)
            {
                console.log(err);
                self.error = err;
            }).then(function ()
            {
                self.loading = false;
                $scope.$apply();
            });
        }

        self.loading = true;
        setTimeout(function ()
        {
            loadData();
        }, 1000);
    }

    app.component('patient', {
        templateUrl: function ()
        {
            return "./src/js/app/patient/patient.html";
        },
        controller: PatientController,
    });

}) (angular.module(constants.appName));