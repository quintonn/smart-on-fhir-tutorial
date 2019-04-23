﻿(function (app)
{
    'use strict';

    allergiesController.$inject = ['$scope', 'dataService'];

    function allergiesController($scope, dataService)
    {
        var self = this;
        self.loading = false;
        self.ready = false;
        self.error = "";

        self.approved = false;

        self.approve = function ()
        {
            self.approved = !self.approved;
            dataService.allergiesApproved = self.approved;
            dataService.checkAllApproved();
        }

        self.allergies = [{ selected: false, name: 'number one' }, { selected: false, name: 'number two' }];

        self.expand = function (item)
        {
            item.expanded = !item.expanded;
        }

        self.select = function (item)
        {
            item.selected = !item.selected;
        }

        self.getAllergies = function ()
        {
            return dataService.allergies;
        }

        function loadData()
        {
            self.loading = true;
            dataService.getAllergies().then(function (data)
            {
                console.log(data);
                self.allergies = data;
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

    app.component('allergies', {
        templateUrl: function ()
        {
            return "./src/js/app/allergies/allergies.html";
        },
        controller: allergiesController,
    });

}) (angular.module(constants.appName));
