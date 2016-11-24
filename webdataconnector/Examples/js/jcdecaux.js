(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {

        tableau.log("Getting Schema");
        
        var cols = [
            {
                id: "number", 
                alias: "Station Number",
                description: "Number of the station. This is NOT an id, thus it is unique only inside a contract",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "name", 
                alias: "Station Name",
                description: "Name of the station",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "address",
                alias: "Station Address",
                description: "Address of the station. As it is raw data, sometimes it will be more of a comment than an address",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "lat",
                alias: "Latitude",
                columnRole: "dimension",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "lng",
                alias: "Longitude",
                columnRole: "dimension",
                dataType: tableau.dataTypeEnum.float
            },
            {   
                id: "banking",
                alias: "Banking Available",
                description: "Indicates whether this station has a payment terminal",
                dataType: tableau.dataTypeEnum.bool
            },
            {
                id: "bonus",
                alias: "Bonus",
                description: "indicates whether this is a bonus station",
                dataType: tableau.dataTypeEnum.bool
            },
            {
                id: "status",
                alias: "Status",
                description: "Indicates whether this station is CLOSED or OPEN",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "contract_name",
                alias: "Contract Name",
                description: "Name of the contract of the station",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "bike_stands",
                alias: "Bike Stands",
                description: "The number of operational bike stands at this station",
                dataType: tableau.dataTypeEnum.int

            },
            {
                id: "available_bike_stands",
                alias: "Available Bike Stands",
                description: "The number of available bike stands at this station",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "available_bikes",
                alias: "Available Bikes",
                description: "The number of available and operational bikes at this station",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "last_update",
                alias: "Last Update",
                description: "Timestamp indicating the last update time in milliseconds since Epoch",
                dataType: tableau.dataTypeEnum.datetime
            }
        ];

        var tableSchema = {
            id: "JCDecauxFeed",
            alias: "JCDecaux",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {

        tableau.log("Getting data");
        
        $.getJSON("https://api.jcdecaux.com/vls/v1/stations?apiKey=" + tableau.connectionData, function(resp) {
            tableau.log("Successfully retrieved data, going to prepare properties");
            var feat = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "number": feat[i].number,
                    "name": feat[i].name,
                    "address": feat[i].address,
                    "lat": feat[i].position.lat,
                    "lng": feat[i].position.lng,
                    "banking": feat[i].banking,
                    "bonus": feat[i].bonus,
                    "status": feat[i].status,
                    "contract_name": feat[i].contract_name,
                    "bike_stands": feat[i].bike_stands,
                    "available_bike_stands": feat[i].available_bike_stands,
                    "available_bikes": feat[i].available_bikes,
                    "last_update": feat[i].last_update,
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    setupConnector = function() {
    var apiKey = $('#apikey').val().trim();
        if (apiKey) {
            tableau.connectionData = apiKey; // set the api key as the connection data so we can get to it when we fetch the data
            tableau.connectionName = 'JCDecaux API Feed: ' + apiKey; // name the data source. This will be the data source name in Tableau
            tableau.submit();
        };
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() { // This event fires when a button is clicked
             setupConnector();
        });
        
        $('#tickerForm').submit(function(event) {
            event.preventDefault();
            setupConnector();
        });
    });
})();
