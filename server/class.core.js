const { groupBy } = require("core-js/actual/array/group-by"); 

// AWS Config Variables
const fs = require('fs');
var configData = JSON.parse(fs.readFileSync('./aws-exports.json'));

//-- AWS Object
const { classAWS } = require('./class.aws.js');
const AWSObject = new classAWS();


//-- Logging Object
const { classLogging } = require('./class.logging.js');


//-- Logging Object
var configuration = require('./configuration');



//--#############
//--############# FUNCTIONS                                                                                        
//--#############


function replaceParameterValues(str, obj) {
  var re = /\{(.+?)\}/g;
  return str.replace(re, function(_,m){return obj[m]});
}



//--#############
//--############# CLASS : classEMRGlobal                                                                                                
//--#############


class classEMRGlobal {

        //-- Looging
        #objLog = new classLogging({ name : "classEMRGlobal", instance : "generic" });
        
        //-- Constructor method
        constructor(object) { 
                        
        }


        //-- Refresh Cluster Data 
        async getGlobalClusterMetrics(object){
            try {
                 
                var result = {
                                totalClusters   : 0,
                                totalCPUs       : 0,
                                totalMemory     : 0,
                                totalNodes      : 0,
                                cpuUsage        : { avg : 0, max : 0, min : 0, p10 : 0, p50 : 0, p90 : 0 },
                                memoryUsage     : { avg : 0, max : 0, min : 0, p10 : 0, p50 : 0, p90 : 0 },
                                totalTimeUsage   : 0,
                                clusters        : [],
                                charts : {
                                            clusters        : [],
                                            cores           : [],
                                            cpus            : [],
                                            memory          : [],
                                            jobsRunning     : [],
                                            clusterLifeCycle : [],
                                            cpuUsage        : { avg : [], max : [], min : [], p10 : [], p50 : [], p90 : [] } ,
                                            memoryUsage     : { avg : [], max : [], min : [], p10 : [], p50 : [], p90 : [] } ,
                                            coresUsage      : { avg : [], max : [], min : [], p10 : [], p50 : [], p90 : [] } ,
                                            roles           : { categories : [], series : [] },
                                            instanceType    : { categories : [], series : [] },
                                            instanceMarket  : { categories : [], series : [] }, 
                                            globalInstanceType : [],
                                            globalInstanceMarket : [],
                                            globalInstanceRole : [],
                                }
                        
                };
                
                //+++++++ SECTION 1 : Gather Nodes By Role 
                 
                var parameters = { period : object.period, filter : object.filter };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B01-clustersByRole'], parameters ) });
                
                
                //-- Roles Grouping
                var roleUnique = records.groupBy( node => node.role )
                var rolesSeries = [];
                var rolesCategories = [];
                for (let item of Object.keys(roleUnique)) {
                        
                        var values = roleUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        rolesSeries.push({ name : item, data : values });
                        
                        if (rolesCategories.length == 0) {
                            rolesCategories = roleUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                //+++++++ SECTION 2 : Gather Nodes By Instance Type 
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B02-clustersByInstanceType'], parameters ) });
                
                
                //-- Roles Grouping
                var instanceTypeUnique = records.groupBy( node => node.instance_type )
                var instanceTypeSeries = [];
                var instanceTypeCategories = [];
                for (let item of Object.keys(instanceTypeUnique)) {
                        
                        var values = instanceTypeUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceTypeSeries.push({ name : item, data : values });
                        
                        if (instanceTypeCategories.length == 0) {
                            instanceTypeCategories = instanceTypeUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                
                //+++++++ SECTION 3 : Gather Nodes By Market Type 
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B03-clustersByInstanceMarket'], parameters ) });
                
                
                //-- Roles Grouping
                var instanceMarketUnique = records.groupBy( node => node.market_type )
                var instanceMarketSeries = [];
                var instanceMarketCategories = [];
                for (let item of Object.keys(instanceMarketUnique)) {
                        
                        var values = instanceMarketUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceMarketSeries.push({ name : item, data : values });
                        
                        if (instanceMarketCategories.length == 0) {
                            instanceMarketCategories = instanceMarketUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                //+++++++ SECTION 4 : Total Clusters
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B04-totalClusters'], parameters ) });
                
                var totalClusters = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 5 : Total CPUs
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B05-totalCPUs'], parameters ) });
                
                var totalCPUs = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 6 : Total Memory
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B06-totalMemory'], parameters ) });
                
                var totalMemory = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 7 : Total Cores
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B07-totalCores'], parameters ) });
                
                var totalCores = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 8 : Total Jobs Running
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B08-totalJobsRunning'], parameters ) });
                
                var totalJobs = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 9 : CPU Usage
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B09-cpuUsage'], parameters ) });
                var cpuUsage = { 
                                    avg : [],
                                    max : [],
                                    min : [],
                                    p10 : [],
                                    p50 : [],
                                    p90 : [],
                };
                
                records.map(function (obj) {
                    cpuUsage['avg'].push([obj.time, obj.cpu_avg]);
                    cpuUsage['max'].push([obj.time, obj.cpu_max]);
                    cpuUsage['min'].push([obj.time, obj.cpu_min]);
                    cpuUsage['p10'].push([obj.time, obj.cpu_p10]);
                    cpuUsage['p50'].push([obj.time, obj.cpu_p50]);
                    cpuUsage['p90'].push([obj.time, obj.cpu_p90]);
                    
                });
                
                
                
                //+++++++ SECTION 10 : Memory Usage
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B10-MemoryUsage'], parameters ) });
                
                var memoryUsage = { 
                                    avg : [],
                                    max : [],
                                    min : [],
                                    p10 : [],
                                    p50 : [],
                                    p90 : [],
                };
                
                records.map(function (obj) {
                    memoryUsage['avg'].push([obj.time, obj.memory_avg]);
                    memoryUsage['max'].push([obj.time, obj.memory_max]);
                    memoryUsage['min'].push([obj.time, obj.memory_min]);
                    memoryUsage['p10'].push([obj.time, obj.memory_p10]);
                    memoryUsage['p50'].push([obj.time, obj.memory_p50]);
                    memoryUsage['p90'].push([obj.time, obj.memory_p90]);
                    
                });
               
                
                
                //+++++++ SECTION 11 : Cores Usage
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B11-coreUsage'], parameters ) });
                
                var coresUsage = { 
                                    avg : [],
                                    max : [],
                                    min : [],
                                    p10 : [],
                                    p50 : [],
                                    p90 : [],
                };
                
                records.map(function (obj) {
                    coresUsage['avg'].push([obj.time, obj.cores_avg]);
                    coresUsage['max'].push([obj.time, obj.cores_max]);
                    coresUsage['min'].push([obj.time, obj.cores_min]);
                    coresUsage['p10'].push([obj.time, obj.cores_p10]);
                    coresUsage['p50'].push([obj.time, obj.cores_p50]);
                    coresUsage['p90'].push([obj.time, obj.cores_p90]);
                    
                });
                
                
                //+++++++ SECTION 12 : Cluster Life Cycle
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B12-clusterLifeCycle'], parameters ) });
                
                var clusterLifeCycle = records.map(function (obj) {
                    return { x : obj.cluster_id, y : [new Date(obj.time_min).getTime() , new Date(obj.time_max).getTime() ] } ;
                });
                
                
                //+++++++ SECTION 13 : Cluster Summary
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B13-summaryClusters'], parameters ) });
                
                var summaryClusters = {
                        totalClusters   : records[0]?.['total_clusters'] || 0,
                        totalCPUs       : records[0]?.['total_vcpu'] || 0,
                        totalMemory     : records[0]?.['total_memory'] || 0,
                        totalNodes      : records[0]?.['total_nodes'] || 0,
                        cpuUsage        : { avg : records[0]?.['cpu_usage_avg'] || 0,max : records[0]?.['cpu_usage_max'] || 0,min : records[0]?.['cpu_usage_min'] || 0, p10 : records[0]?.['cpu_usage_p10'] || 0, p50 : records[0]?.['cpu_usage_p50'] || 0, p90 : records[0]?.['cpu_usage_p90'] || 0 },
                        memoryUsage     : { avg : records[0]?.['memory_usage_avg'] || 0, p10 : records[0]?.['memory_usage_p10'] || 0, p50 : records[0]?.['memory_usage_p50'] || 0, p90 : records[0]?.['memory_usage_p90'] || 0 },
                };
                
                
                //+++++++ SECTION 14 : Cluster Summary by Instance Type
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B14-summaryByInstanceType'], parameters ) });
                
                var globalInstanceType = records.map(function (obj) {
                          return { name : obj.instance_type, value : obj.total};
                });
                   
                   
                
                //+++++++ SECTION 15 : Cluster Summary by Instance Market
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B15-summaryByInstanceMarket'], parameters ) });
                
                var globalInstanceMarket = records.map(function (obj) {
                          return { name : obj.market_type, value : obj.total};
                });     
                
                
                //+++++++ SECTION 16 : Cluster Summary by Instance Role
                 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B16-summaryByInstanceRole'], parameters ) });
                
                var globalInstanceRole = records.map(function (obj) {
                          return { name : obj.role, value : obj.total};
                });
                
                
                
                //+++++++ SECTION 17 : Cluster Summary by Instance Role
                
                var clusters = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B17-summaryClusterTable'], parameters ) });
                
                
                
                //+++++++ SECTION 18 : Cluster Summary by Instance Role
                
                var totalTimeUsage = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['Q-B18-clustersTotalTime'], parameters ) });
                
                
                
                
                
                result = { 
                            ...summaryClusters,
                            totalTimeUsage : totalTimeUsage[0]?.['total_hours'] || 0,
                            clusters : clusters,
                            charts : {
                                        clusters            : totalClusters, 
                                        cpus                : totalCPUs,
                                        cores               : totalCores,
                                        memory              : totalMemory,
                                        jobsRunning         : totalJobs,
                                        clusterLifeCycle    : clusterLifeCycle,
                                        cpuUsage            : { ...cpuUsage } ,
                                        memoryUsage         : { ...memoryUsage } ,
                                        coresUsage          : { ...coresUsage } ,
                                        roles               : { categories : rolesCategories, series : rolesSeries },
                                        instanceType        : { categories : instanceTypeCategories, series : instanceTypeSeries },
                                        instanceMarket      : { categories : instanceMarketCategories, series : instanceMarketSeries },
                                        globalInstanceType  : globalInstanceType,
                                        globalInstanceMarket  : globalInstanceMarket,
                                        globalInstanceRole  : globalInstanceRole,
                            },
                };
                
            }
            catch(error) {
                    this.#objLog.write("refreshData","err",error);
            }
            
            return result;
            
            
        }
        
        
        
        //-- Refresh Cluster Data 
        async getGlobalClusterLiveMetrics(object){
            
            var clusterStats =  {
                                    clusterId       : "",
                                    name            : "",
                                    status          : "-",
                                    collectionType  : "-",
                                    release         : "-",
                                    applications    : "-",
                                    os              : "-",
                                    lastUpdate      : "-",
                                    host            : {
                                                        
                                                        totalVCPUs      : 0,
                                                        totalMemory     : 0,
                                                        totalNodes      : 0,
                                                        cpuUsage        : 0,
                                                        memoryUsage     : 0,
                                                        networkTotal    : 0,
                                                        networkSent     : 0,
                                                        networkRecv     : 0,
                                                        diskIopsReads   : 0,
                                                        diskIopsWrites  : 0,
                                                        diskIops        : 0,
                                                        diskBytesReads  : 0,
                                                        diskBytesWrites : 0,
                                                        diskBytes       : 0,
                                                        clusters        : [],
                                                        charts          : {
                                                                            cpu                 : { avg : [], max : [], min : [] },
                                                                            memory              : { avg : [], max : [], min : [] },
                                                                            diskBytes           : { avg : [], max : [], min : [] },
                                                                            diskIops            : { avg : [], max : [], min : [] },
                                                                            network             : { avg : [], max : [], min : [] },
                                                                            rolesColumn         : { series : [], categories : [] },
                                                                            instanceTypeColumn  : { series : [], categories : [] },
                                                                            instanceMarketColumn : { series : [], categories : [] },
                                                                            instanceTypes       : [],
                                                                            marketTypes         : [],
                                                                            roles               : [],
                                                                            stepsLifeCycle      : [],
                                                                            
                                                        },
                                    },
                                    hadoop : {
                                                coresAvailable          : 0,
                                                coresAllocated          : 0,              
                                                coresPending            : 0,              
                                                coresTotal              : 0,              
                                                coresUsage              : 0,                  
                                                coresReserved           : 0,              
                                                memoryAllocated         : 0,
                                                memoryAvailable         : 0,              
                                                memoryPending           : 0,       
                                                memoryReserved          : 0,              
                                                memoryTotal             : 0,              
                                                memoryUsage             : 0,              
                                                appsCompleted           : 0,
                                                appsFailed              : 0,        
                                                appsKilled              : 0,
                                                appsPending             : 0,
                                                appsRunning             : 0,
                                                appsSubmitted           : 0,
                                                containersAllocated     : 0,          
                                                containersPending       : 0,              
                                                containersReserved      : 0,              
                                                nodesActive             : 0,
                                                nodesDecommissioned     : 0,              
                                                nodesDecommissioning    : 0,              
                                                nodesLost               : 0,              
                                                nodesRebooted           : 0,
                                                nodesShutdown           : 0,              
                                                nodesTotal              : 0,              
                                                nodesUnhealthy          : 0,              
                                                charts                  : {
                                                                            coresAvailable          : [],
                                                                            coresAllocated          : [],
                                                                            coresPending            : [],
                                                                            coresTotal              : [],
                                                                            coresUsage              : [],
                                                                            coresReserved           : [],
                                                                            nodesActive             : [],
                                                                            memoryAllocated         : [],
                                                                            memoryAvailable         : [],
                                                                            memoryPending           : [],
                                                                            memoryReserved          : [],
                                                                            memoryTotal             : [],
                                                                            memoryUsage             : [],
                                                                            appsCompleted           : [],
                                                                            appsFailed              : [],
                                                                            appsKilled              : [],
                                                                            appsPending             : [],
                                                                            appsRunning             : [],
                                                                            appsSubmitted           : [],
                                                                            containersAllocated     : [],
                                                                            containersPending       : [],
                                                                            containersReserved      : [],
                                                                            nodesDecommissioned     : [],
                                                                            nodesdecommissioning    : [],
                                                                            nodesLost               : [],
                                                                            nodesRebooted           : [],
                                                                            nodesShutdown           : [],
                                                                            nodesTotal              : [],
                                                                            nodesUnhealthy          : [],
                                                }
                                        
                                    }
            };
            
            try {
                
                
                //+++++++ SECTION 1 : Gather Node Performance Information (Table)
                
                var clustersSummary = await AWSObject.executeTSQuery({ query : configuration['queries']['global-live']['Q-E01-nodesSummary'] });
                
                
                var totalClusters = 0;
                var totalNodes = 0;
                var totalVCPUs = 0;
                var totalMemory = 0;
                clustersSummary.forEach(item => {
                        totalNodes = totalNodes + item.total_nodes;
                        totalVCPUs = totalVCPUs + item.total_vcpu;
                        totalMemory = totalMemory + item.total_memory;
                        totalClusters++;
                });
                
                 
                //+++++++ SECTION 2 : Gather Nodes By Role 
                 
                var parameters = { period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global-live']['Q-E02-nodesByRole'], parameters ) });
                
                
                //-- Roles Grouping
                var roleUnique = records.groupBy( node => node.role )
                var rolesSeries = [];
                var rolesCategories = [];
                for (let item of Object.keys(roleUnique)) {
                        
                        var values = roleUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        rolesSeries.push({ name : item, data : values });
                        
                        if (rolesCategories.length == 0) {
                            rolesCategories = roleUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                
                //+++++++ SECTION 3 : Gather Nodes By Instance Types
                
                
                var parameters = { period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global-live']['Q-E03-nodesByInstanceType'], parameters ) });
                
                
                //-- Instances Grouping
                var instanceTypesUnique = records.groupBy( node => node.instance_type )
                var instanceTypesSeries = [];
                var instanceTypesCategories = [];
                for (let item of Object.keys(instanceTypesUnique)) {
                        
                        var values = instanceTypesUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceTypesSeries.push({ name : item, data : values });
                        
                        if (instanceTypesCategories.length == 0) {
                            instanceTypesCategories = instanceTypesUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                //+++++++ SECTION 4 : Gather Nodes By Market Type
                
                
                var parameters = {  period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global-live']['Q-E04-nodesByMarketType'], parameters ) });
                
                
                //-- Instances Grouping
                var instanceMarketUnique = records.groupBy( node => node.market_type )
                var instanceMarketSeries = [];
                var instanceMarketCategories = [];
                for (let item of Object.keys(instanceMarketUnique)) {
                        
                        var values = instanceMarketUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceMarketSeries.push({ name : item, data : values });
                        
                        if (instanceMarketCategories.length == 0) {
                            instanceMarketCategories = instanceMarketUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                
                //+++++++ SECTION 5 : Steps LifeCycle
               
                var clusterList = await AWSObject.getEMRClusters({ ClusterStates: ["RUNNING"] });
                var stepsLifeCycle = [];
                
                for (const cluster of clusterList['Clusters']) {
                        var stepList = await AWSObject.getEMRClusterSteps({ ClusterId: cluster.Id, StepStates: ['RUNNING'] });
                        if (Array.isArray(stepList['Steps'])){
                            stepList['Steps'].forEach(function(obj) {
                                stepsLifeCycle.push( { 
                                                        clusterId : cluster.Id, 
                                                        id : obj['Id'], 
                                                        name : obj['Name'] , 
                                                        status : obj['Status']?.['State'] , 
                                                        creationDateTime : obj['Status']?.['Timeline']?.['CreationDateTime'], 
                                                        startDateTime : obj['Status']?.['Timeline']?.['StartDateTime'], 
                                                        endDateTime : obj['Status']?.['Timeline']?.['EndDateTime'], 
                                                        x :"Cluster:" + cluster.Id  + ", Job:" + obj.Id, 
                                                        y : [new Date(obj['Status']?.['Timeline']?.['StartDateTime']).getTime() , ( obj['Status']?.['Timeline']?.['EndDateTime'] !== undefined ? new Date(obj['Status']?.['Timeline']?.['EndDateTime']).getTime() : new Date().getTime())  ] } );
                            });
                        }
                };
                
                
                //+++++++ SECTION 5 : Gather Hadoop Performance (Table)
                
                var parameters = { period : '5m' };
                var hadoopSummary = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global-live']['Q-E06-clusterHadoopSummary'], parameters ) });
                
                
                
                //+++++++ SECTION 6 : Instances by Type
                
                var parameters = { period : '5m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global-live']['Q-E07-NodesByTypes'], parameters ) });
                
                //-- Instance Types Summary
                var stats = records.groupBy(node => node.instance_type);
                var instanceTypes = [];
                for (let item of Object.keys(stats)) {
                        instanceTypes.push({ name : item, value : stats[item].length });
                }
                
                instanceTypes.sort((a, b) => {
                    let fa = a.name.toLowerCase(),fb = b.name.toLowerCase();
                    if (fa < fb) 
                        return -1;
                    if (fa > fb) 
                        return 1;
                    return 0;
                });

                
                //-- Instance Market Type Summary
                stats = records.groupBy(node => node.market_type);
                var marketTypes = [];
                for (let item of Object.keys(stats)) {
                        marketTypes.push({ name : item, value : stats[item].length });
                }
                
                marketTypes.sort((a, b) => {
                    let fa = a.name.toLowerCase(),fb = b.name.toLowerCase();
                    if (fa < fb) 
                        return -1;
                    if (fa > fb) 
                        return 1;
                    return 0;
                });
                
                
                //-- Instance role
                stats = records.groupBy(node => node.role);
                var roles = [];
                for (let item of Object.keys(stats)) {
                        roles.push({ name : item, value : stats[item].length });
                }               
                
                roles.sort((a, b) => {
                    let fa = a.name.toLowerCase(),fb = b.name.toLowerCase();
                    if (fa < fb) 
                        return -1;
                    if (fa > fb) 
                        return 1;
                    return 0;
                });
                
                
                //+++++++ SECTION 7 : Gather Cluster Performance Information over time
                
                    
                var parameters = { period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global-live']['Q-E05-clusterHostSummary'], parameters ) });
            
                 
                //-- CPU
                var cpuAvg = records.map(function (obj) {
                    return [obj.time, obj.cpu_usage_avg] ;
                });
                
                var cpuMax = records.map(function (obj) {
                    return [obj.time, obj.cpu_usage_max] ;
                });
                
                var cpuMin = records.map(function (obj) {
                    return [obj.time, obj.cpu_usage_min] ;
                });
               
                   
                //-- Memory    
                var memoryAvg = records.map(function (obj) {
                  return [obj.time, obj.memory_usage_avg];
                });
                
                var memoryMax = records.map(function (obj) {
                  return [obj.time, obj.memory_usage_max];
                });
                
                var memoryMin = records.map(function (obj) {
                  return [obj.time, obj.memory_usage_min];
                });
                
                //-- Network
                var networkAvg  = records.map(function (obj) {
                  return [obj.time, obj.network_bytes_avg];
                });
                
                var networkMax  = records.map(function (obj) {
                  return [obj.time, obj.network_bytes_max];
                });
                
                var networkMin  = records.map(function (obj) {
                  return [obj.time, obj.network_bytes_min];
                });
                
                //--Disk Bytes
                var diskBytesAvg = records.map(function (obj) {
                  return [obj.time, obj.disk_bytes_avg];
                });
                
                var diskBytesMax = records.map(function (obj) {
                  return [obj.time, obj.disk_bytes_max];
                });
                
                var diskBytesMin = records.map(function (obj) {
                  return [obj.time, obj.disk_bytes_min];
                });
                
                //-- Disk Iops
                var diskIopsAvg = records.map(function (obj) {
                  return [obj.time, obj.disk_iops_avg];
                });
                
                var diskIopsMax = records.map(function (obj) {
                  return [obj.time, obj.disk_iops_max];
                });
                
                var diskIopsMin = records.map(function (obj) {
                  return [obj.time, obj.disk_iops_min];
                });
                
                
                
                
                //+++++++ SECTION SUMMARY 
                
                clusterStats = { 
                                        ...clusterStats, 
                                        lastUpdate : new Date().toTimeString().split(' ')[0],
                                        host : {
                                                    ...{
                                                        totalVCPUs : totalVCPUs,
                                                        totalMemory : totalMemory,
                                                        totalClusters : totalClusters,
                                                        totalNodes    : totalNodes,
                                                        cpuUsage : records[records.length-2]?.['cpu_usage_avg'],
                                                        memoryUsage : records[records.length-2]?.['memory_usage_avg'],
                                                        networkTotal : records[records.length-2]?.['network_bytes'],
                                                        networkSent : records[records.length-2]?.['network_sent_bytes'],
                                                        networkRecv : records[records.length-2]?.['network_recv_bytes'],
                                                        diskIopsReads : records[records.length-2]?.['disk_io_reads'],
                                                        diskIopsWrites : records[records.length-2]?.['disk_io_writes'],
                                                        diskIops : records[records.length-2]?.['disk_iops'],
                                                        diskBytesReads : records[records.length-2]?.['disk_bytes_reads'],
                                                        diskBytesWrites : records[records.length-2]?.['disk_bytes_writes'],
                                                        diskBytes : records[records.length-2]?.['disk_bytes'],
                                                        clusters : clustersSummary,
                                                    }, 
                                                    charts : { 
                                                                cpu                 : { avg : cpuAvg, max : cpuMax, min : cpuMin },
                                                                memory              : { avg : memoryAvg, max : memoryMax, min : memoryMin },
                                                                diskBytes           : { avg : diskBytesAvg, max : diskBytesMax, min : diskBytesMin },
                                                                diskIops            : { avg : diskIopsAvg, max : diskIopsMax, min : diskIopsMin },
                                                                network             : { avg : networkAvg, max : networkMax, min : networkMin },
                                                                rolesColumn         : { series : rolesSeries, categories : rolesCategories },
                                                                instanceTypesColumn : { series : instanceTypesSeries, categories : instanceTypesCategories },
                                                                instanceMarketColumn : { series : instanceMarketSeries, categories : instanceMarketCategories },
                                                                instanceTypes       : instanceTypes, 
                                                                marketTypes         : marketTypes, 
                                                                roles               : roles,
                                                                stepsLifeCycle      : stepsLifeCycle,
                                                    }
                                        },
                                        hadoop : {
                                                     ...hadoopSummary[0]
                                        }
                    
                };
                
                
            } catch(error) {
                    this.#objLog.write("getGlobalClusterLiveMetrics","err",error);
                    
            }
            
            return clusterStats;
            
            
        }
        
        
        //-- Get Cluster Metrics
        async getClusterStatsDetails(object){
            var result = {};
            try {
                
                var parameters = {  filter : " time between ago(" + object.period + ") and now() and cluster_id='" + object.clusterId + "'" };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global-live']['Q-E08-clusterMetricsDetails'], parameters ) });
            
                var stats = {
                                cpu : {
                                    avg : [],
                                    min : [],
                                    max : [],
                                },
                                memory : {
                                    avg : [],
                                    min : [],
                                    max : [],
                                },
                                network : {
                                    avg : [],
                                    min : [],
                                    max : [],
                                },
                                iops : {
                                    avg : [],
                                    min : [],
                                    max : [],
                                },
                                disk : {
                                    avg : [],
                                    min : [],
                                    max : [],
                                },
                };
                
                var item = records.map(function (obj) {
                    
                    stats['cpu']['avg'].push([obj.time, obj.cpu_usage_avg]);
                    stats['cpu']['min'].push([obj.time, obj.cpu_usage_min]);
                    stats['cpu']['max'].push([obj.time, obj.cpu_usage_max]);
                    
                    stats['memory']['avg'].push([obj.time, obj.memory_usage_avg]);
                    stats['memory']['min'].push([obj.time, obj.memory_usage_min]);
                    stats['memory']['max'].push([obj.time, obj.memory_usage_max]);
                    
                    stats['iops']['avg'].push([obj.time, obj.disk_iops_avg]);
                    stats['iops']['min'].push([obj.time, obj.disk_iops_min]);
                    stats['iops']['max'].push([obj.time, obj.disk_iops_max]);
                    
                    stats['disk']['avg'].push([obj.time, obj.disk_bytes_avg]);
                    stats['disk']['min'].push([obj.time, obj.disk_bytes_min]);
                    stats['disk']['max'].push([obj.time, obj.disk_bytes_max]);
                    
                    stats['network']['avg'].push([obj.time, obj.network_bytes_avg]);
                    stats['network']['min'].push([obj.time, obj.network_bytes_min]);
                    stats['network']['max'].push([obj.time, obj.network_bytes_max]);
                    
                    
                });
                
                result = { 
            
                            cpuUsage : records[records.length-1]?.['cpu_usage_avg'],
                            memoryUsage : records[records.length-1]?.['memory_usage_avg'],
                            networkTotal : records[records.length-1]?.['network_bytes_avg'],
                            diskIops : records[records.length-1]?.['disk_iops_avg'],
                            diskBytes : records[records.length-1]?.['disk_bytes_avg'],
                            charts : { 
                                        ...stats
                            },
                };
                
                
            } catch(error) {
                
                this.#objLog.write("getClusterStats","err",error);
                
            }
            
            return result;
            
        }
        
}

//--#############
//--############# CLASS : classEMRCluster                                                                                                
//--#############


class classEMRCluster {

        
        //-- Looging
        #objLog = new classLogging({ name : "classEMRCluster", instance : "generic" });
        
        
        //-- Cluster Metrics
        #metrics = {};
        #metricList = [];
        #dimension = [];
        #metricCatalog = {
                        'MemoryAvailableMB' : { factor : 1, type : "Average", label : "memoryFreeMB" },
        };
        
        //--  Metadata
        #clusterMetadata = {};
        #instances =  [];
        #clusterStats =  {
                                clusterId       : "",
                                name            : "",
                                status          : "-",
                                collectionType  : "-",
                                release         : "-",
                                applications    : "-",
                                os              : "-",
                                lastUpdate      : "-",
                                host            : {
                                                    
                                                    totalVCPUs      : 0,
                                                    totalMemory     : 0,
                                                    totalNodes      : 0,
                                                    cpuUsage        : 0,
                                                    memoryUsage     : 0,
                                                    networkTotal    : 0,
                                                    networkSent     : 0,
                                                    networkRecv     : 0,
                                                    diskIopsReads   : 0,
                                                    diskIopsWrites  : 0,
                                                    diskIops        : 0,
                                                    diskBytesReads  : 0,
                                                    diskBytesWrites : 0,
                                                    diskBytes       : 0,
                                                    nodes           : [],
                                                    charts          : {
                                                                        cpu                 : { avg : [], max : [], min : [] },
                                                                        memory              : { avg : [], max : [], min : [] },
                                                                        diskBytes           : { avg : [], max : [], min : [] },
                                                                        diskIops            : { avg : [], max : [], min : [] },
                                                                        network             : { avg : [], max : [], min : [] },
                                                                        rolesColumn         : { series : [], categories : [] },
                                                                        instanceTypeColumn  : { series : [], categories : [] },
                                                                        instanceMarketColumn : { series : [], categories : [] },
                                                                        instanceTypes       : [],
                                                                        marketTypes         : [],
                                                                        roles               : [],
                                                                        stepsLifeCycle      : [],
                                                                        
                                                    },
                                },
                                hadoop : {
                                            coresAvailable          : 0,
                                            coresAllocated          : 0,              
                                            coresPending            : 0,              
                                            coresTotal              : 0,              
                                            coresUsage              : 0,                  
                                            coresReserved           : 0,              
                                            memoryAllocated         : 0,
                                            memoryAvailable         : 0,              
                                            memoryPending           : 0,       
                                            memoryReserved          : 0,              
                                            memoryTotal             : 0,              
                                            memoryUsage             : 0,              
                                            appsCompleted           : 0,
                                            appsFailed              : 0,        
                                            appsKilled              : 0,
                                            appsPending             : 0,
                                            appsRunning             : 0,
                                            appsSubmitted           : 0,
                                            containersAllocated     : 0,          
                                            containersPending       : 0,              
                                            containersReserved      : 0,              
                                            nodesActive             : 0,
                                            nodesDecommissioned     : 0,              
                                            nodesDecommissioning    : 0,              
                                            nodesLost               : 0,              
                                            nodesRebooted           : 0,
                                            nodesShutdown           : 0,              
                                            nodesTotal              : 0,              
                                            nodesUnhealthy          : 0,              
                                            charts                  : {
                                                                        coresAvailable          : [],
                                                                        coresAllocated          : [],
                                                                        coresPending            : [],
                                                                        coresTotal              : [],
                                                                        coresUsage              : [],
                                                                        coresReserved           : [],
                                                                        nodesActive             : [],
                                                                        memoryAllocated         : [],
                                                                        memoryAvailable         : [],
                                                                        memoryPending           : [],
                                                                        memoryReserved          : [],
                                                                        memoryTotal             : [],
                                                                        memoryUsage             : [],
                                                                        appsCompleted           : [],
                                                                        appsFailed              : [],
                                                                        appsKilled              : [],
                                                                        appsPending             : [],
                                                                        appsRunning             : [],
                                                                        appsSubmitted           : [],
                                                                        containersAllocated     : [],
                                                                        containersPending       : [],
                                                                        containersReserved      : [],
                                                                        nodesDecommissioned     : [],
                                                                        nodesdecommissioning    : [],
                                                                        nodesLost               : [],
                                                                        nodesRebooted           : [],
                                                                        nodesShutdown           : [],
                                                                        nodesTotal              : [],
                                                                        nodesUnhealthy          : [],
                                            }
                                    
                                }
        };
        
        
        
        //-- Object Properties
        objectProperties;
        
        
        //-- Constructor method
        constructor(object) { 
            
                this.objectProperties = object.properties;
                this.#objLog.properties = {...this.#objLog.properties, clusterId : this.objectProperties.clusterId }
                            
        }
        
        
        //-- Gather Metadata
        async gatherMetadata(){
        
                var parameter = {
                   ClusterId: this.objectProperties.clusterId
                };
    
    
                try {
                    
                    this.#clusterMetadata = await AWSObject.getEMRClusterMetadata(parameter);
                    
                    
                } catch(error) {
                    this.#objLog.write("gatherMetadata","err",error);
                    
                }
            
        }
        
        
        //-- Gather CloudWatch Metrics
        async getCloudWatchMetrics(){
            
            
            
            const clwMetrics = await AWSObject.getGenericMetricsDataset({ metrics : this.#metricList, interval : 60, period : 1 });
            
            var result = {};
            clwMetrics.forEach(item => {
                    try {
                            
                            const values = item['Timestamps'].map((record,iPosition) => [record,item['Values'][iPosition]]); 
                            result = { ...result, [item.Label] : values };
                            return 
                            
                    }
                    catch(err){
                        this.#objLog.write("getCloudWatchMetrics","err",err);
                    }
            });
            
            return result;
        
        }
        
        
        //-- Refresh Cluster Data 
        async refreshData(){
            try {
                
                //-- Update Metadata
                this.gatherMetadata();
                
                
                //+++++++ SECTION 1 : Gather Node Performance Information (Table)
                
                var parameters = { cluster_id : this.objectProperties.clusterId };
                var nodesSummary = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['cluster']['Q-C01-nodesSummary'], parameters ) });
                
                
                //-- Instance Types Summary
                var stats = nodesSummary.groupBy(node => node.instance_type);
                var instanceTypes = [];
                for (let item of Object.keys(stats)) {
                        instanceTypes.push({ name : item, value : stats[item].length });
                }
                
                instanceTypes.sort((a, b) => {
                    let fa = a.name.toLowerCase(),fb = b.name.toLowerCase();
                    if (fa < fb) 
                        return -1;
                    if (fa > fb) 
                        return 1;
                    return 0;
                });

                
                //-- Instance Market Type Summary
                stats = nodesSummary.groupBy(node => node.market_type);
                var marketTypes = [];
                for (let item of Object.keys(stats)) {
                        marketTypes.push({ name : item, value : stats[item].length });
                }
                
                marketTypes.sort((a, b) => {
                    let fa = a.name.toLowerCase(),fb = b.name.toLowerCase();
                    if (fa < fb) 
                        return -1;
                    if (fa > fb) 
                        return 1;
                    return 0;
                });
                
                
                //-- Instance role
                stats = nodesSummary.groupBy(node => node.role);
                var roles = [];
                for (let item of Object.keys(stats)) {
                        roles.push({ name : item, value : stats[item].length });
                }               
                
                roles.sort((a, b) => {
                    let fa = a.name.toLowerCase(),fb = b.name.toLowerCase();
                    if (fa < fb) 
                        return -1;
                    if (fa > fb) 
                        return 1;
                    return 0;
                });
                
                
                var totalNodes = 0;
                var totalVCPUs = 0;
                var totalMemory = 0;
                nodesSummary.forEach(item => {
                        totalVCPUs = totalVCPUs + item.total_vcpu;
                        totalMemory = totalMemory + item.total_memory;
                        totalNodes++;
                });
                
                 
                //+++++++ SECTION 2 : Gather Nodes By Role 
                 
                var parameters = { cluster_id : this.objectProperties.clusterId, period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['cluster']['Q-C02-nodesByRole'], parameters ) });
                
                
                //-- Roles Grouping
                var roleUnique = records.groupBy( node => node.role )
                var rolesSeries = [];
                var rolesCategories = [];
                for (let item of Object.keys(roleUnique)) {
                        
                        var values = roleUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        rolesSeries.push({ name : item, data : values });
                        
                        if (rolesCategories.length == 0) {
                            rolesCategories = roleUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                
                //+++++++ SECTION 3 : Gather Nodes By Instance Types
                
                
                var parameters = { cluster_id : this.objectProperties.clusterId, period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['cluster']['Q-C03-nodesByInstanceType'], parameters ) });
                
                
                //-- Instances Grouping
                var instanceTypesUnique = records.groupBy( node => node.instance_type )
                var instanceTypesSeries = [];
                var instanceTypesCategories = [];
                for (let item of Object.keys(instanceTypesUnique)) {
                        
                        var values = instanceTypesUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceTypesSeries.push({ name : item, data : values });
                        
                        if (instanceTypesCategories.length == 0) {
                            instanceTypesCategories = instanceTypesUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                //+++++++ SECTION 4 : Gather Nodes By Market Type
                
                
                var parameters = { cluster_id : this.objectProperties.clusterId, period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['cluster']['Q-C04-nodesByMarketType'], parameters ) });
                
                
                //-- Instances Grouping
                var instanceMarketUnique = records.groupBy( node => node.market_type )
                var instanceMarketSeries = [];
                var instanceMarketCategories = [];
                for (let item of Object.keys(instanceMarketUnique)) {
                        
                        var values = instanceMarketUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceMarketSeries.push({ name : item, data : values });
                        
                        if (instanceMarketCategories.length == 0) {
                            instanceMarketCategories = instanceMarketUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                
                //+++++++ SECTION 5 : Steps LifeCycle
                
                var records = await AWSObject.getEMRClusterSteps({ 
                                                                      ClusterId: this.objectProperties.clusterId,
                                                                      StepStates: ['COMPLETED','RUNNING'],
                });
                
                var stepsLifeCycle = [];
                if (Array.isArray(records['Steps'])){
                    stepsLifeCycle = records['Steps'].map(function (obj) {
                        return { state : obj['Status']?.['State'] , x : obj.Id, y : [new Date(obj['Status']?.['Timeline']?.['StartDateTime']).getTime() , ( obj['Status']?.['Timeline']?.['EndDateTime'] !== undefined ? new Date(obj['Status']?.['Timeline']?.['EndDateTime']).getTime() : new Date().getTime())  ] } ;
                    });
                }
                
                
                //+++++++ SECTION 6 : Gather Cluster Performance Information over time
                
                    
                var parameters = { cluster_id : this.objectProperties.clusterId, period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['cluster']['Q-C05-clusterHostSummary'], parameters ) });
            
                 
                //-- CPU
                var cpuAvg = records.map(function (obj) {
                    return [obj.time, obj.cpu_usage_avg] ;
                });
                
                var cpuMax = records.map(function (obj) {
                    return [obj.time, obj.cpu_usage_max] ;
                });
                
                var cpuMin = records.map(function (obj) {
                    return [obj.time, obj.cpu_usage_min] ;
                });
               
                   
                //-- Memory    
                var memoryAvg = records.map(function (obj) {
                  return [obj.time, obj.memory_usage_avg];
                });
                
                var memoryMax = records.map(function (obj) {
                  return [obj.time, obj.memory_usage_max];
                });
                
                var memoryMin = records.map(function (obj) {
                  return [obj.time, obj.memory_usage_min];
                });
                
                //-- Network
                var networkAvg  = records.map(function (obj) {
                  return [obj.time, obj.network_bytes_avg];
                });
                
                var networkMax  = records.map(function (obj) {
                  return [obj.time, obj.network_bytes_max];
                });
                
                var networkMin  = records.map(function (obj) {
                  return [obj.time, obj.network_bytes_min];
                });
                
                //--Disk Bytes
                var diskBytesAvg = records.map(function (obj) {
                  return [obj.time, obj.disk_bytes_avg];
                });
                
                var diskBytesMax = records.map(function (obj) {
                  return [obj.time, obj.disk_bytes_max];
                });
                
                var diskBytesMin = records.map(function (obj) {
                  return [obj.time, obj.disk_bytes_min];
                });
                
                //-- Disk Iops
                var diskIopsAvg = records.map(function (obj) {
                  return [obj.time, obj.disk_iops_avg];
                });
                
                var diskIopsMax = records.map(function (obj) {
                  return [obj.time, obj.disk_iops_max];
                });
                
                var diskIopsMin = records.map(function (obj) {
                  return [obj.time, obj.disk_iops_min];
                });
                
                
                //+++++++ SECTION 7 : Gather Hadoop Performance (Table)
                
                var parameters = { cluster_id : this.objectProperties.clusterId, period : '5m' };
                var hadoopSummary = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['cluster']['Q-C06-clusterHadoopSummary'], parameters ) });
                
                
                
                
                //+++++++ SECTION SUMMARY 
                
                this.#clusterStats = { 
                                        ...this.#clusterStats, 
                                        lastUpdate : new Date().toTimeString().split(' ')[0],
                                        host : {
                                                    ...{
                                                        totalVCPUs : totalVCPUs,
                                                        totalMemory : totalMemory,
                                                        totalNodes : totalNodes,
                                                        cpuUsage : records[records.length-2]?.['cpu_usage_avg'],
                                                        memoryUsage : records[records.length-2]?.['memory_usage_avg'],
                                                        networkTotal : records[records.length-2]?.['network_bytes'],
                                                        networkSent : records[records.length-2]?.['network_sent_bytes'],
                                                        networkRecv : records[records.length-2]?.['network_recv_bytes'],
                                                        diskIopsReads : records[records.length-2]?.['disk_io_reads'],
                                                        diskIopsWrites : records[records.length-2]?.['disk_io_writes'],
                                                        diskIops : records[records.length-2]?.['disk_iops'],
                                                        diskBytesReads : records[records.length-2]?.['disk_bytes_reads'],
                                                        diskBytesWrites : records[records.length-2]?.['disk_bytes_writes'],
                                                        diskBytes : records[records.length-2]?.['disk_bytes'],
                                                        nodes : nodesSummary,
                                                    }, 
                                                    charts : { 
                                                                cpu                 : { avg : cpuAvg, max : cpuMax, min : cpuMin },
                                                                memory              : { avg : memoryAvg, max : memoryMax, min : memoryMin },
                                                                diskBytes           : { avg : diskBytesAvg, max : diskBytesMax, min : diskBytesMin },
                                                                diskIops            : { avg : diskIopsAvg, max : diskIopsMax, min : diskIopsMin },
                                                                network             : { avg : networkAvg, max : networkMax, min : networkMin },
                                                                rolesColumn         : { series : rolesSeries, categories : rolesCategories },
                                                                instanceTypesColumn : { series : instanceTypesSeries, categories : instanceTypesCategories },
                                                                instanceMarketColumn : { series : instanceMarketSeries, categories : instanceMarketCategories },
                                                                instanceTypes       : instanceTypes, 
                                                                marketTypes         : marketTypes, 
                                                                roles               : roles,
                                                                stepsLifeCycle      : stepsLifeCycle,
                                                    }
                                        },
                                        hadoop : {
                                                     ...hadoopSummary[0]
                                        }
                    
                };
                
                
            } catch(error) {
                    this.#objLog.write("refreshData","err",error);
                    
            }
            
            
        }
        
        //-- Get Cluster Information
        async getClusterData(){
            try {
                
                await this.refreshData();
                
                return {
                        ...this.#clusterStats,
                        clusterId       : this.#clusterMetadata['Cluster']?.['Id'],
                        name            : this.#clusterMetadata['Cluster']?.['Name'],
                        status          : this.#clusterMetadata['Cluster']?.['Status']?.['State'],
                        collectionType  : this.#clusterMetadata['Cluster']?.['InstanceCollectionType'],
                        release         : this.#clusterMetadata['Cluster']?.['ReleaseLabel'],
                        applications    : this.#clusterMetadata['Cluster']?.['Applications'],
                        os              : this.#clusterMetadata['Cluster']?.['OSReleaseLabel'],
                };
                
                
            } catch(error) {
                    this.#objLog.write("getClusterData","err",error);
                    
            }
            
            
        }
        
        
        //-- Get Cluster Steps
        async getClusterSteps(object){
            
            try {
                
                var result = await AWSObject.getEMRClusterSteps(object);
                return result;
                
            } catch(error) {
                this.#objLog.write("getClusterSteps","err",error);
                
            }
            
        }
        
        
        //-- Get Node Metrics
        async getNodeStats(object){
            var result = {};
            try {
                
                
                var parameters = { cluster_id : this.objectProperties.clusterId, instance_id : object.instanceId, period : '15m' };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['node']['Q-D01-metricsDetails'], parameters ) });
            
                var cpu = records.map(function (obj) {
                    return [obj.time, obj.cpu_usage] ;
                });
                
                var memory = records.map(function (obj) {
                    return [obj.time, obj.memory_usage] ;
                });
                
                var netSent = records.map(function (obj) {
                    return [obj.time, obj.network_sent] ;
                });
                
                var netRecv = records.map(function (obj) {
                    return [obj.time, obj.network_recv] ;
                });
                
                var diskReadBytes = records.map(function (obj) {
                    return [obj.time, obj.disk_read_bytes] ;
                });
                
                var diskWriteBytes = records.map(function (obj) {
                    return [obj.time, obj.disk_write_bytes] ;
                });
                
                var diskReadIops = records.map(function (obj) {
                    return [obj.time, obj.disk_read_iops] ;
                });
                
                var diskWriteIops = records.map(function (obj) {
                    return [obj.time, obj.disk_write_iops] ;
                });
                
                result = { 
            
                            cpuUsage : records[records.length-1]?.['cpu_usage'],
                            memoryUsage : records[records.length-1]?.['memory_usage'],
                            networkTotal : records[records.length-1]?.['network_bytes'],
                            networkSent : records[records.length-1]?.['network_sent'],
                            networkRecv : records[records.length-1]?.['network_recv'],
                            diskIopsReads : records[records.length-1]?.['disk_read_iops'],
                            diskIopsWrites : records[records.length-1]?.['disk_write_iops'],
                            diskIops : records[records.length-1]?.['disk_iops'],
                            diskBytesReads : records[records.length-1]?.['disk_read_bytes'],
                            diskBytesWrites : records[records.length-1]?.['disk_write_bytes'],
                            diskBytes : records[records.length-1]?.['disk_bytes'],
                            charts : { 
                                        cpu                 : cpu,
                                        memory              : memory,
                                        networkSent         : netSent,
                                        networkRecv         : netRecv,
                                        diskReadBytes       : diskReadBytes,
                                        diskWriteBytes      : diskWriteBytes,
                                        diskReadIops        : diskReadIops,
                                        diskWriteIops       : diskWriteIops
                            },
                };
                
                
            } catch(error) {
                
                this.#objLog.write("getNodeStats","err",error);
                
            }
            
            return result;
            
        }
        
        
        
        async getAllNodesMetrics(object){
            
            
            var result = {
                            nodes : []
            };
            
            try{
            
                var parameters = { period : object.period, filter : object.filter };
                var nodes = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['global']['summaryNodesTable'], parameters ) });
                
                result = {
                            nodes : nodes  
                };
            
            } catch(error) {
                
                this.#objLog.write("getAllNodesMetrics","err",error);
                
            }
            
            return result;
            
        }
        
        
        
        
        //-- Get Cluster History Metrics
        async getHistoryClusterMetrics(object){
            try {
                 
                var clusterId = object.clusterId;
                var result = {
                                totalCPUs       : 0,
                                totalMemory     : 0,
                                totalNodes      : 0,
                                cpuUsage        : { avg : 0, max : 0, min : 0, p10 : 0, p50 : 0, p90 : 0 },
                                memoryUsage     : { avg : 0, max : 0, min : 0, p10 : 0, p50 : 0, p90 : 0 },
                                nodes           : [],
                                clusterSteps    : [],
                                charts : {
                                            clusters        : [],
                                            cores           : [],
                                            cpus            : [],
                                            memory          : [],
                                            jobsRunning     : [],
                                            stepsLifeCycle  : [],
                                            cpuUsage        : { avg : [], max : [], min : [], p10 : [], p50 : [], p90 : [] } ,
                                            memoryUsage     : { avg : [], max : [], min : [], p10 : [], p50 : [], p90 : [] } ,
                                            coresUsage      : { avg : [], max : [], min : [], p10 : [], p50 : [], p90 : [] } ,
                                            roles           : { categories : [], series : [] },
                                            instanceType    : { categories : [], series : [] },
                                            instanceMarket  : { categories : [], series : [] }, 
                                            globalInstanceType : [],
                                            globalInstanceMarket : [],
                                            globalInstanceRole : [],
                                }
                        
                };
                
                //+++++++ SECTION 1 : Gather Nodes By Role 
                 
                var parameters = { period : object.period, filter : object.filter };
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A01-clustersByRole'], parameters ) });
                
                
                //-- Roles Grouping
                var roleUnique = records.groupBy( node => node.role )
                var rolesSeries = [];
                var rolesCategories = [];
                for (let item of Object.keys(roleUnique)) {
                        
                        var values = roleUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        rolesSeries.push({ name : item, data : values });
                        
                        if (rolesCategories.length == 0) {
                            rolesCategories = roleUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                //+++++++ SECTION 2 : Gather Nodes By Instance Type 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A02-clustersByInstanceType'], parameters ) });
                
                
                //-- Roles Grouping
                var instanceTypeUnique = records.groupBy( node => node.instance_type )
                var instanceTypeSeries = [];
                var instanceTypeCategories = [];
                for (let item of Object.keys(instanceTypeUnique)) {
                        
                        var values = instanceTypeUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceTypeSeries.push({ name : item, data : values });
                        
                        if (instanceTypeCategories.length == 0) {
                            instanceTypeCategories = instanceTypeUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
                
                //+++++++ SECTION 3 : Gather Nodes By Market Type 
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A03-clustersByInstanceMarket'], parameters ) });
                
                
                //-- Roles Grouping
                var instanceMarketUnique = records.groupBy( node => node.market_type )
                var instanceMarketSeries = [];
                var instanceMarketCategories = [];
                for (let item of Object.keys(instanceMarketUnique)) {
                        
                        var values = instanceMarketUnique[item].map(function (obj) {
                          return obj.total;
                        });
                        
                        instanceMarketSeries.push({ name : item, data : values });
                        
                        if (instanceMarketCategories.length == 0) {
                            instanceMarketCategories = instanceMarketUnique[item].map(function (obj) {
                              return obj.time;
                            });
                        }
                }
                
             
                //+++++++ SECTION 5 : Total CPUs
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A04-totalCPUs'], parameters ) });
                
                var totalCPUs = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 6 : Total Memory
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A05-totalMemory'], parameters ) });
                
                var totalMemory = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 7 : Total Cores
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A06-totalCores'], parameters ) });
                
                var totalCores = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 8 : Total Jobs Running
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A07-totalJobsRunning'], parameters ) });
                
                var totalJobs = records.map(function (obj) {
                    return [obj.time, obj.total] ;
                });
                
                
                //+++++++ SECTION 9 : CPU Usage
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A08-cpuUsage'], parameters ) });
                
                var cpuUsage = { 
                                    avg : [],
                                    max : [],
                                    min : [],
                                    p10 : [],
                                    p50 : [],
                                    p90 : [],
                };
                
                records.map(function (obj) {
                    cpuUsage['avg'].push([obj.time, obj.cpu_avg]);
                    cpuUsage['max'].push([obj.time, obj.cpu_max]);
                    cpuUsage['min'].push([obj.time, obj.cpu_min]);
                    cpuUsage['p10'].push([obj.time, obj.cpu_p10]);
                    cpuUsage['p50'].push([obj.time, obj.cpu_p50]);
                    cpuUsage['p90'].push([obj.time, obj.cpu_p90]);
                    
                });
                
                
                
                
                //+++++++ SECTION 10 : Memory Usage
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A09-MemoryUsage'], parameters ) });
                
                var memoryUsage = { 
                                    avg : [],
                                    max : [],
                                    min : [],
                                    p10 : [],
                                    p50 : [],
                                    p90 : [],
                };
                
                records.map(function (obj) {
                    memoryUsage['avg'].push([obj.time, obj.memory_avg]);
                    memoryUsage['max'].push([obj.time, obj.memory_max]);
                    memoryUsage['min'].push([obj.time, obj.memory_min]);
                    memoryUsage['p10'].push([obj.time, obj.memory_p10]);
                    memoryUsage['p50'].push([obj.time, obj.memory_p50]);
                    memoryUsage['p90'].push([obj.time, obj.memory_p90]);
                    
                });
                
                
                
                //+++++++ SECTION 11 : Cores Usage
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A10-coreUsage'], parameters ) });
                
                var coresUsage = { 
                                    avg : [],
                                    max : [],
                                    min : [],
                                    p10 : [],
                                    p50 : [],
                                    p90 : [],
                };
                
                records.map(function (obj) {
                    coresUsage['avg'].push([obj.time, obj.cores_avg]);
                    coresUsage['max'].push([obj.time, obj.cores_max]);
                    coresUsage['min'].push([obj.time, obj.cores_min]);
                    coresUsage['p10'].push([obj.time, obj.cores_p10]);
                    coresUsage['p50'].push([obj.time, obj.cores_p50]);
                    coresUsage['p90'].push([obj.time, obj.cores_p90]);
                    
                });
                
                
                //+++++++ SECTION 12 : Steps LifeCycle
                
                var records = await AWSObject.getEMRClusterSteps({ 
                                                                      ClusterId: object.clusterId,
                                                                      StepStates: ['COMPLETED','RUNNING'],
                });
                
                var stepsLifeCycle = [];
                if (Array.isArray(records['Steps'])){
                    stepsLifeCycle = records['Steps'].map(function (obj) {
                        return { state : obj['Status']?.['State'] , x : obj.Id, y : [new Date(obj['Status']?.['Timeline']?.['StartDateTime']).getTime() , ( obj['Status']?.['Timeline']?.['EndDateTime'] !== undefined ? new Date(obj['Status']?.['Timeline']?.['EndDateTime']).getTime() : new Date().getTime())  ] } ;
                    });
                }
                
                
                
                //+++++++ SECTION 13 : Cluster Steps
                
                var clusterSteps = await AWSObject.getEMRClusterSteps({ 
                                                                      ClusterId: object.clusterId
                });
                
                if (Array.isArray(clusterSteps['Steps'])){
                    clusterSteps = clusterSteps['Steps'];
                }
                else {
                    clusterSteps = []
                }
                
                
                //+++++++ SECTION 14 : Cluster Summary
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A11-summaryClusters'], parameters ) });
                
                var summaryClusters = {
                        totalClusters   : records[0]?.['total_clusters'] || 0,
                        totalCPUs       : records[0]?.['total_vcpu'] || 0,
                        totalMemory     : records[0]?.['total_memory'] || 0,
                        totalNodes      : records[0]?.['total_nodes'] || 0,
                        cpuUsage        : { avg : records[0]?.['cpu_usage_avg'] || 0,max : records[0]?.['cpu_usage_max'] || 0,min : records[0]?.['cpu_usage_min'] || 0, p10 : records[0]?.['cpu_usage_p10'] || 0, p50 : records[0]?.['cpu_usage_p50'] || 0, p90 : records[0]?.['cpu_usage_p90'] || 0 },
                        memoryUsage     : { avg : records[0]?.['memory_usage_avg'] || 0, p10 : records[0]?.['memory_usage_p10'] || 0, p50 : records[0]?.['memory_usage_p50'] || 0, p90 : records[0]?.['memory_usage_p90'] || 0 },
                };
                
                
                //+++++++ SECTION 15 : Cluster Summary by Instance Type
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A12-summaryByInstanceType'], parameters ) });
                
                var globalInstanceType = records.map(function (obj) {
                          return { name : obj.instance_type, value : obj.total};
                });
                   
                   
                
                //+++++++ SECTION 16 : Cluster Summary by Instance Market
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A13-summaryByInstanceMarket'], parameters ) });
                
                var globalInstanceMarket = records.map(function (obj) {
                          return { name : obj.market_type, value : obj.total};
                });     
                
                
                //+++++++ SECTION 17 : Cluster Summary by Instance Role
                
                var records = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A14-summaryByInstanceRole'], parameters ) });
                
                var globalInstanceRole = records.map(function (obj) {
                          return { name : obj.role, value : obj.total};
                });
                
                
                
                //+++++++ SECTION 18 : Cluster Summary by Instance Role
                
                var nodes = await AWSObject.executeTSQuery({ query : replaceParameterValues(configuration['queries']['history']['Q-A15-summaryNodesTable'], parameters ) });
                
                
                result = { 
                            ...summaryClusters,
                            nodes           : nodes,
                            clusterSteps    : clusterSteps,
                            charts : {
                                        cpus                : totalCPUs,
                                        cores               : totalCores,
                                        memory              : totalMemory,
                                        jobsRunning         : totalJobs,
                                        stepsLifeCycle      : stepsLifeCycle,
                                        cpuUsage            : { ...cpuUsage } ,
                                        memoryUsage         : { ...memoryUsage } ,
                                        coresUsage          : { ...coresUsage } ,
                                        roles               : { categories : rolesCategories, series : rolesSeries },
                                        instanceType        : { categories : instanceTypeCategories, series : instanceTypeSeries },
                                        instanceMarket      : { categories : instanceMarketCategories, series : instanceMarketSeries },
                                        globalInstanceType  : globalInstanceType,
                                        globalInstanceMarket  : globalInstanceMarket,
                                        globalInstanceRole  : globalInstanceRole,
                            },
                };
                
            }
            catch(error) {
                    this.#objLog.write("getHistoryClusterMetrics","err",error);
            }
            
            return result;
            
            
        }
        
        

}


module.exports = { classEMRCluster, classEMRGlobal };



                