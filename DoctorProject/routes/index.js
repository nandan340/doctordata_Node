var mongo = require("../routes/mongo");
var mongoSessionConnectURL = "mongodb://nandan123:nandan123@ds145121.mlab.com:45121/nandandb";
var request = require('request');
var CronJob = require('cron').CronJob;
var mongoXlsx = require('mongo-xlsx');

/* GET home page. */
function displayIndex(req, res){
	res.render('index', { title: 'Express' });
}


var job = new CronJob('* */30 * * * *', function() {
	console.log('Update databasese job run');
// run at 30 min to get database updates
	updateDatabase();   

  }, function () {
    
  },
  true, 
  'America/Los_Angeles'
);


function updateDatabase(req, res){

	request('https://openpaymentsdata.cms.gov/resource/a482-xr32.json?%24limit=5000&%24%24app_token=YX209OguGoq0jEx3TXYFNvxVm', function (error, response, body) {
		  
		var incomingJSON = JSON.parse(body);
		var coll = mongo.collection('doctorData');		//collection data in coll

		for(var i = 0 ; i < incomingJSON.length ; i++)
		{
			var singleJSON = incomingJSON[i];
			singleJSON._id = singleJSON.record_id;

			if(singleJSON.total_amount_of_payment_usdollars >= 10)
			{
				coll.insert(singleJSON, function(err, data){

				});
			}
		}

	});
}


function findData(req, res){


	var data = req.param("data"); 

	var model = mongoXlsx.buildDynamicModel(data);

	mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
	  console.log('File saved at:', data.fullPath); 
	  res.send({"path" : data.fullPath});
	});
}

function getAllData(req, res){
	console.log("getAllData");

	var json_responses = {};

		var coll = mongo.collection('doctorData');		//collection data in coll
		
		coll.find({},{}).toArray(function(err, data){	//retrive data
			
			if (data) 
			{
				json_responses = {"data" : data};
				res.send(json_responses);
			} 
			
			else 
			{
				console.log("Error in data");
			}
		});
};

exports.displayIndex = displayIndex;
exports.getAllData = getAllData;
exports.findData = findData;
exports.updateDatabase = updateDatabase;