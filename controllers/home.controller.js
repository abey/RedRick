(function () {
    'use strict';

    angular
        .module('redrickApp')
        .controller('HomeController', HomeController);


    HomeController.$inject = ['$location', '$parse', '$scope', '$rootScope', 'config'];
    function HomeController($location, $parse, $scope, $rootScope, config) {
        var redrick = this;
        redrick.loading = false;
        redrick.option3 = null;
        redrick.noProducts = false;

        function readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }

      redrick.encode = function(){
        JsBarcode("#barcode", redrick.barcode_input);
      }

      redrick.optionOneSelected = function() {
          redrick.option1 = $scope.optionOne;
          var url = "app-content/json/option_2/" + redrick.option1.id + ".json";
          readTextFile(url, function(text){
              var data = JSON.parse(text);
              $scope.option_2 = data.option_2;
              $scope.$digest();
          });
      };

      redrick.optionTwoSelected = function() {
          redrick.option2 = $scope.optionTwo;
          var url = "app-content/json/option_3.json";
          readTextFile(url, function(text){
              var data = JSON.parse(text);
              var the_string = "option_3_" + redrick.option1.id + "_" + redrick.option2.id;
              $scope.option_3 = data[the_string];
              redrick.noProducts = false;
              if(data[the_string]==null) {
                redrick.noProducts = true;
                redrick.pdtData1 = $scope.optionOne.name;
                redrick.pdtData2 = $scope.optionTwo.name;
              }
              $scope.$digest();
          });
      };

      redrick.optionThreeSelected = function() {
          redrick.option3 = $scope.optionThree;
          createBarcode();
      };

      function createBarcode() {
        var url = "app-content/json/bk-source.json";
        readTextFile(url, function(text){
            var data = angular.fromJson(text);
            redrick.barcodeSource = data;
            var op2ShortName;
            for(var i=0; i<redrick.barcodeSource.length; i++)
            {
                if ($scope.optionTwo.name == redrick.barcodeSource[i].name)
                {
                  op2ShortName = redrick.barcodeSource[i].code;
                }
            }
            var payload = $scope.optionOne.id + "-" + op2ShortName + "-" + $scope.optionThree.id;
            JsBarcode("#productBarcode", payload);
        });
      }

      //usage:
      readTextFile("app-content/json/option_1.json", function(text){
          var data = JSON.parse(text);
          $scope.option_1 = data.option_1;
          $scope.optionOne = $scope.option_1[0];
      });

    }

})();
