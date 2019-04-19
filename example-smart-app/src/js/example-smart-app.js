(function(window){
  window.extractData = function() {
    console.log('extract data');
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        console.log('patient');
        console.log(pt);
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4']
                      }
                    }
                  });
        var obvAll = smart.patient.api.fetchAll({type: 'Observation'});

        $.when(pt, obv, obvAll).fail(onError);

        $.when(pt, obv, obvAll).done(function(patient, obv, obvAll) {

          console.log('got all info');
          console.log(patient);
          console.log(obv);
          console.log(obvAll);

          var observationTable = $("allObservations");
          observationTable.empty();

          obvAll.forEach(function(observation) 
          {
              if (typeof observation.code != 'undefined' && observation.code != null)
              {
                var code = observation.code.text;
                var value = getObsValue(observation);
                observationTable.append("<tr><th>"+code+":</th><td>"+value+"</td></tr>");
              }
              else
              {
                console.log('observation has no codes');
                console.log(typeof observation.code);
                console.log(observation.code);
                console.log(observation);
              }


          });

          var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;

          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');
          }

          var height = byCodes('8302-2');
          var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
          var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
          var hdl = byCodes('2085-9');
          var ldl = byCodes('2089-1');

          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;
          p.height = getQuantityValueAndUnit(height[0]);

          if (typeof systolicbp != 'undefined')  {
            p.systolicbp = systolicbp;
          }

          if (typeof diastolicbp != 'undefined') {
            p.diastolicbp = diastolicbp;
          }

          p.hdl = getQuantityValueAndUnit(hdl[0]);
          p.ldl = getQuantityValueAndUnit(ldl[0]);

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function getObsValue(obs)
  {
    if (typeof obs != 'undefined')
    {
       if (typeof obs.valueQuantity != 'undefined' && typeof obs.valueQuantity.value != 'undefined' && typeof obs.valueQuantity.unit != 'undefined')
       {
          return obs.valueQuantity.value + ' ' + obs.valueQuantity.unit;
       }

       if (typeof obs.valueCodeableConcept != 'undefined' && typeof obs.valueCodeableConcept.text != 'undefined')
       {
          return obs.valueCodeableConcept.text;
       }
       if (typeof obs.valueString != 'undefined')
       {
          return obs.valueString;
       }
       if (typeof obs.valueBoolean != 'undefined')
       {
          return obs.valueBoolean;
       }
       if (typeof obs.valueInteger != 'undefined')
       {
          return obs.valueInteger;
       }
       console.log('observation value is unhandled at this time:');
       console.log(obs);
    } 

      return "";
  }

  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      height: {value: ''},
      systolicbp: {value: ''},
      diastolicbp: {value: ''},
      ldl: {value: ''},
      hdl: {value: ''},
    };
  }

  function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function(observation){
      var BP = observation.component.find(function(component){
        return component.code.coding.find(function(coding) {
          return coding.code == typeOfPressure;
        });
      });
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
          return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);
  };

})(window);
