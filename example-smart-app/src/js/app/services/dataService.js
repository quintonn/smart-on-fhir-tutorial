(function (app)
{
    'use strict';

    function dataService()
    {
        var self = this;
        self.smart = null;
        self.ready = false;

        var service =
        {
            getPatientData: getPatientData,
            getAllergies: getAllergies,
            getMedications: getMedications,
            allergies: [],
            medications: [],
            summary: "",
            error: "",
            isValid: isValid,            
            checkAllApproved: checkAllApproved,
            canSubmit: false,
            sectionApproved: [],
            approveSection: approveSection
        };

        function approveSection(section, approve)
        {
            if (approve == true && service.sectionApproved.indexOf(section) == -1)
            {
                service.sectionApproved.push(section);
                service.sectionApproved = service.sectionApproved.filter(function (value, index, arr)
                {
                    return true;
                });
            }
            else if (approve == false && service.sectionApproved.indexOf(section) > -1)
            {
                service.sectionApproved = service.sectionApproved.filter(function (value, index, arr)
                {

                    return value != section;
                });
            }
        }

        function checkAllApproved()
        {
            service.canSubmit = approveSection.length >= 2;

            return service.canSubmit;
        }

        function isValid(value)
        {
            if (typeof value == "undefined" || value == null || value == null || value.length == 0)
            {
                return false;
            }
            return true;
        }

        function getAllergies()
        {
            if (self.ready == false && service.error == "")
            {
                return new Promise(function (res, rej)
                {
                    setTimeout(function ()
                    {
                        return getAllergies().then(function (resp)
                        {
                            res(resp);
                        }).catch(rej);
                    }, 100);
                });
            }
            if (service.error != "")
            {
                return Promise.reject(service.error);
            }

            var allergies = self.smart.patient.api.fetchAll({ type: "AllergyIntolerance" });

            return new Promise(function (res, rej)
            {
                $.when(allergies).fail(function (e)
                {
                    rej(e);
                });

                $.when(allergies).done(function (allergies)
                {
                    service.allergies = allergies;
                    res(allergies);
                });
            });
        }

        function getMedications()
        {
            if (self.ready == false && service.error == "")
            {
                return new Promise(function (res, rej)
                {
                    setTimeout(function ()
                    {
                        return getMedications().then(function (resp)
                        {
                            res(resp);
                        }).catch(rej);
                    }, 100);
                });
            }
            if (service.error != "")
            {
                return Promise.reject(service.error);
            }

            var medications = self.smart.patient.api.fetchAll({ type: "MedicationStatement" });

            return new Promise(function (res, rej)
            {
                $.when(medications).fail(function (e)
                {
                    rej(e);
                });

                $.when(medications).done(function (medications)
                {
                    service.medications = medications;
                    res(medications);
                });
            });
        }

        function getPatientData()
        {
            if (self.ready == false && service.error == "")
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
            if (service.error != "")
            {
                return Promise.reject(service.error);
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
            service.error = e;
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

        console.log(window.location);
        console.log(window.location.href);
        FHIR.oauth2.ready(onReady, onError);

        return service;
    }

    app.service('dataService', dataService);

})(angular.module(constants.appName));
