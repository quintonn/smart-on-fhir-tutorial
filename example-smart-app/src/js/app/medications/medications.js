﻿(function (app)
{
    'use strict';

    medicationsController.$inject = ['$scope', 'dataService'];

    function medicationsController($scope, dataService)
    {
        var self = this;
        self.loading = false;
        self.ready = false;
        self.error = "";

        self.approved = false;

        self.approve = function ()
        {
            self.approved = !self.approved;
            dataService.checkAllApproved();
            
            dataService.approveSection("medications", self.approved);
        }

        self.medications = [{ selected: false, name: 'number one' }, { selected: false, name: 'number two' }];

        self.expand = function (item)
        {
            item.expanded = !item.expanded;
        }

        self.select = function (item)
        {
            item.selected = !item.selected;
        }

        self.getData = function ()
        {
            return dataService.medications;
        }

        function loadData()
        {
            self.loading = true;
            dataService.getMedications().then(function (data)
            {
                console.log(data);
                self.medications = data;
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

    app.component('medications', {
        templateUrl: function ()
        {
            return "./src/js/app/medications/medications.html?v=1";
        },
        controller: medicationsController,
    });

}) (angular.module(constants.appName));
