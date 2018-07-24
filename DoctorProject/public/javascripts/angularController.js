var doctorApp = angular.module('doctorApp', ['ui.bootstrap']);

doctorApp.controller('doctorController', function($scope, $http){

	$scope.tableData;
	$scope.filteredTableData;

	//$scope.selected = undefined;
	//$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', '49503', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

	$scope.cityList = [];

	$scope.assignSearchText = function()
	{
		$scope.customSearchText = $scope.searchText;
	}

	$scope.checkIfEmpty = function()
	{
		if($scope.searchText == "")
		$scope.customSearchText = "";
	}

	$scope.exportToExcel = function(){

		console.log("angular exportToExcel "+$scope.filteredTableData);

	    $http.post("/findData", {"data" : $scope.filteredTableData}).
		then(function(response) {

			if(response){

				alert("Excel file saved at project location with name "+response.data.path);

			}

		});


	}


	$scope.getData = function(){

		$http.get("/getAllData").
		then(function(response) {

			console.log("response received "+response);
			
			if(response)
			{
				$scope.tableData = response.data.data;
				$scope.filteredTableData = response.data.data;

				for(var i = 0 ; i < $scope.tableData.length ; i++)
				{
					var city = $scope.tableData[i].recipient_city;
					if($scope.cityList.indexOf(city.toLowerCase()) < 0)
					{
						$scope.cityList.push(city.toLowerCase());
					}
				}
			}
			else
			{
				alert("Error in fetching data");
			}

		});
	}


	$scope.getData();

});