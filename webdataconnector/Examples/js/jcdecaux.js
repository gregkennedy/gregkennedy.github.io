(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        tableau.log("Getting Schema");
        var cols = [
            {
                id: "number",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "name",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "address",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "lat",
                dataType: tableau.dataTypeEnum.float
                    // { id: "lat", dataType: tableau.dataTypeEnum.float },
                    // { id: "lng", dataType: tableau.dataTypeEnum.float }
            },
            {
                id: "lng",
                dataType: tableau.dataTypeEnum.float
                    // { id: "lat", dataType: tableau.dataTypeEnum.float },
                    // { id: "lng", dataType: tableau.dataTypeEnum.float }
            },
            {   
                id: "banking",
                dataType: tableau.dataTypeEnum.bool
            },
            {
                id: "bonus",
                dataType: tableau.dataTypeEnum.bool
            },
            {
                id: "status",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "contract_name",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "bike_stands",
                dataType: tableau.dataTypeEnum.int

            },
            {
                id: "available_bike_stands",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "available_bikes",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "last_update",
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
        $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=07bba5d491c9f596fd2e4377ee97cb4beedd2513", function(resp) {
            tableau.log("Have data, going to prepare properties");
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

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "JCDecaux Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
