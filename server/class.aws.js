// AWS Config Variables
const fs = require('fs');
var configData = JSON.parse(fs.readFileSync('./aws-exports.json'));


//--## AWS Libraries
const { EMRClient, ListClustersCommand, DescribeClusterCommand, ListInstancesCommand, ListStepsCommand } = require("@aws-sdk/client-emr"); 
const { CloudWatchClient, GetMetricDataCommand } = require("@aws-sdk/client-cloudwatch");
const { CloudWatchLogsClient, GetLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
const { TimestreamQueryClient, QueryCommand } = require("@aws-sdk/client-timestream-query"); // CommonJS import

//--## AWS Variables
const awsConfig = {region: configData.aws_region}
const emr = new EMRClient(awsConfig);
const cloudwatch = new CloudWatchClient(awsConfig);
const cloudwatchlogs = new CloudWatchLogsClient(awsConfig);


//--#############
//--############# CLASS : classAWS                                                                                                
//--#############


class classTimeStreams {

        constructor(object) { 
                 
                 this.queryClient = new TimestreamQueryClient({
                        region: configData.aws_region
                 });
 
          }
        
        async executeQuery(object){

                
                var records = [];
                const params = new QueryCommand({
                        QueryString: object.query,
                    });
        
        
                const getAllRows = async (queryClient, query, nextToken) => {
                    
                
                    if (nextToken) {
                        params.input.NextToken = nextToken
                    }
                
                    await queryClient.send(params).then(
                            async (response) => {
                                records = records.concat(this.parseQueryResult(response));
                                if (response.NextToken) {
                                    await getAllRows(queryClient, query, response.NextToken);
                                }
                            },
                            (err) => {
                                console.error("Error while querying:", err);
                            });
                }
                
                await getAllRows(this.queryClient, object.query, null);
                return records; 
        
        }
        
        
        parseQueryResult(response) {
            const columnInfo = response.ColumnInfo;
            const rows = response.Rows;
            
            var results = [];
            rows.forEach(row => {
                results.push(this.parseRow(columnInfo, row));
            });
            return results;
        }
        
        
        parseRow(columnInfo, row) {
            const data = row.Data;
            var rowOutput = {};
        
            var i;
            for ( i = 0; i < data.length; i++ ) {
                let info = columnInfo[i];
                let datum = data[i];
                rowOutput = {...rowOutput, ...this.parseDatum(info, datum)};
            }
        
            return rowOutput;
        }
        
        parseDatum(info, datum) {
            if (datum.NullValue != null && datum.NullValue === true) {
                return { [info.Name] : null } ;
            }
        
            const columnType = info.Type;
        
            // If the column is of TimeSeries Type
            if (columnType.TimeSeriesMeasureValueColumnInfo != null) {
                return this.parseTimeSeries(info, datum);
            }
            // If the column is of Array Type
            else if (columnType.ArrayColumnInfo != null) {
                const arrayValues = datum.ArrayValue;
                return `${info.Name} : ${this.parseArray(info.Type.ArrayColumnInfo, arrayValues)}`;
            }
            // If the column is of Row Type
            else if (columnType.RowColumnInfo != null) {
                const rowColumnInfo = info.Type.RowColumnInfo;
                const rowValues = datum.RowValue;
                return this.parseRow(rowColumnInfo, rowValues);
            }
            // If the column is of Scalar Type
            else {
                return this.parseScalarType(info, datum);
            }
        }
        
        parseTimeSeries(info, datum) {
            const timeSeriesOutput = [];
            datum.TimeSeriesValue.forEach(function (dataPoint) {
                timeSeriesOutput.push(`{time : "${dataPoint.Time}", value=${this.parseDatum(info.Type.TimeSeriesMeasureValueColumnInfo, dataPoint.Value)}}`)
            });
        
            return `[${timeSeriesOutput.join(", ")}]`
        }
        
        parseScalarType(info, datum) {
            return {[info.Name] : ( isNaN(datum.ScalarValue) ? datum.ScalarValue : parseFloat(datum.ScalarValue)  ) };
        }
        
        parseArray(arrayColumnInfo, arrayValues) {
            const arrayOutput = [];
            arrayValues.forEach(function (datum) {
                arrayOutput.push(this.parseDatum(arrayColumnInfo, datum));
            });
            return `[${arrayOutput.join(", ")}]`
        }

        
        isNumber(value) {
            return typeof value === 'number';
        }
        
        

        
}


class classAWS {

        constructor(object) { 
                 
                 this.timeStreamClient = new classTimeStreams();
                
 
          }
        
        
        //------#################
        //------################# EMR
        //------#################
        
        
        
        //------################# Get Cluster Metadata
        
        async getEMRClusterMetadata(parameter){
             
            try {
            
                const command = new DescribeClusterCommand(parameter);
                const response = await emr.send(command);
                
                return response;
                
            }
            catch(err){
                console.log(err);
                return [];
            }

        }
        
        
        async getEMRClusterInstances(parameter){
             
            try {
            
                const command = new ListInstancesCommand(parameter);
                const response = await emr.send(command);
                
                return response;
                
            }
            catch(err){
                console.log(err);
                return [];
            }

        }
        
        
        async getEMRClusterSteps(parameter){
             
            try {
            
                const command = new ListStepsCommand(parameter);
                const response = await emr.send(command);
                
                return response;
                
            }
            catch(err){
                console.log(err);
                return [];
            }

        }
        
        
        async getEMRGlobalClusterSteps(parameter){
             
            try {
            
                const command = new ListStepsCommand(parameter);
                const response = await emr.send(command);
                
                return response;
                
            }
            catch(err){
                console.log(err);
                return [];
            }

        }
        
        
        
        //------#################
        //------################# CloudWatch
        //------#################
        
        //-- getGenericMetricsDataset
        async getGenericMetricsDataset(object){
            
            try {
                    
                        
                    //-- Gather Metrics from CloudWatch
                    
                    var dataQueries = [];
                    var queryId = 0;
                    object.metrics.forEach(function(item) {
                        
                        dataQueries.push({
                                Id: "m0" + String(queryId),
                                MetricStat: {
                                    Metric: {
                                        Namespace: item.namespace,
                                        MetricName: item.metric,
                                        Dimensions: item.dimension
                                    },
                                    Period: object.period * 60,
                                    Stat: item.stat
                                },
                                Label: item.label
                        });
                        queryId++;
                        
                    });
                    
                    var d_end_time = new Date();
                    var d_start_time = new Date(d_end_time - (( object.interval  ) * 60000) );
                    var queryClw = {
                        MetricDataQueries: dataQueries,
                        "StartTime": d_start_time,
                        "EndTime": d_end_time
                    };
                   
                    const command = new GetMetricDataCommand(queryClw);
                    const data = await cloudwatch.send(command);
                            
                    return data.MetricDataResults;
                    
            }
            catch(err){
                
                console.log(err);
                return [];
                
            }
            
            
        }
        
        
        //-- getGenericMetricsInsight
        async getGenericMetricsInsight(object){
            
            try {
         
                var dataQueries = [
                        {
                            "Expression": object.sqlQuery,
                            "Id": "q1",
                            "Period": object.period
                        }    
                ];
                
                var d_end_time = new Date();
                var d_start_time = new Date(d_end_time - (( object.interval ) * 60000) );
                var queryClw = {
                    MetricDataQueries: dataQueries,
                    "StartTime": d_start_time,
                    "EndTime": d_end_time
                };
                
                const command = new GetMetricDataCommand(queryClw);
                const data = await cloudwatch.send(command);
                            
                return data.MetricDataResults;
            }
            catch(err){
                console.log(err);
                return [];
            }
            
        }
        
        //------#################
        //------################# API CORE
        //------#################
        
        
        async getEMRClusters(parameter){
             
            try {
            
                const command = new ListClustersCommand(parameter);
                const response = await emr.send(command);

                return response;
                
            }
            catch(err){
                console.log(err);
                return [];
            }

        }
        
        
        //------#################
        //------################# TIMESTREAM
        //------#################
        
        
        
        //------################# Execute Query TimeStream
        
        async executeTSQuery(parameter){
             
            try {
            
                //{ query : params.sqlQuery }
                var response = await this.timeStreamClient.executeQuery(parameter);
                return response;
                
            }
            catch(err){
                console.log(err);
                return [];
            }

        }
        
        
        
}



module.exports = { classAWS };