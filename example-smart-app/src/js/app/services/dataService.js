(function (app)
{
    'use strict';

    function dataService()
    {
        var self = this;
        self.smart = null;
        self.error = "";
        self.ready = false;

        var service =
        {
            getPatientData: getPatientData
        };

        function getPatientData()
        {
            if (self.ready == false && self.error == "")
            {
                return new Promise(function (res, rej)
                {
                    setTimeout(function ()
                    {
                        return getPatientData().then(function (resp)
                        {
                            res(resp);
                        }).catch(rej);
                    }, 100);
                });
            }
            if (self.error != "")
            {
                return Promise.reject(self.error);
            }

            var patient = self.smart.patient.read();

            return new Promise(function (res, rej)
            {
                $.when(patient).fail(function (e)
                {
                    rej(e);
                });

                $.when(patient).done(function (patient)
                {
                    res(patient);
                });
            });
        }

        function onReady(smart)
        {
            self.smart = smart;
            self.ready = true;

            //$('#loading').hide();
        }

        function onError(e)
        {
            console.log(e);
            //self.error = e;
            self.ready = false;
            onReady();
        }
        
        try
        {
            /*
            var x= FHIR.oauth2.authorize({
                'client_id': '2335dd3f-27a5-4780-8654-b068f85afaf6',
                'scope': 'patient/Patient.read patient/Observation.read patient/Encounter.read patient/AllergyIntolerance.read user/Patient.read user/Observation.read user/Encounter.read launch/patient launch/encounter online_access openid profile'
            });
            console.log('xxxxxx');
            console.log(x);
            */
        }
        catch (err)
        {
            console.log("ERROR");
            console.log(err);
        }

        FHIR.oauth2.ready(onReady, onError);

        return service;
    }

    app.service('dataService', dataService);

})(angular.module(constants.appName));
