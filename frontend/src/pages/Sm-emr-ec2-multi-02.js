import {useState,useEffect,useRef} from 'react'
import Axios from 'axios'
import { configuration, SideMainLayoutHeader,SideMainLayoutMenu } from './Configs';
import { useSearchParams } from 'react-router-dom';

import { createLabelFunction, customFormatNumberLong, customFormatNumber, customFormatDateDifference } from '../components/Functions';

import ContentLayout from '@cloudscape-design/components/content-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Header from "@cloudscape-design/components/header";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Spinner from "@cloudscape-design/components/spinner";
import { SplitPanel } from '@cloudscape-design/components';
import AppLayout from '@cloudscape-design/components/app-layout';
import Select from "@cloudscape-design/components/select";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Container from "@cloudscape-design/components/container";
import CustomHeader from "../components/Header";
import Tabs from "@cloudscape-design/components/tabs";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import ExpandableSection from "@cloudscape-design/components/expandable-section";

import CompMetric01  from '../components/Metric01';
import ChartLine04  from '../components/ChartLine04';
import CustomTable02 from "../components/Table02";
import ChartRadialBar01 from '../components/ChartRadialBar01';
import ChartPie01 from '../components/ChartPie-01';
import ChartColumn01  from '../components/ChartColumn01';
import ChartTimeLine01  from '../components/ChartTimeLine01';

import '@aws-amplify/ui-react/styles.css';

export const splitPanelI18nStrings: SplitPanelProps.I18nStrings = {
  preferencesTitle: 'Split panel preferences',
  preferencesPositionLabel: 'Split panel position',
  preferencesPositionDescription: 'Choose the default split panel position for the service.',
  preferencesPositionSide: 'Side',
  preferencesPositionBottom: 'Bottom',
  preferencesConfirm: 'Confirm',
  preferencesCancel: 'Cancel',
  closeButtonAriaLabel: 'Close panel',
  openButtonAriaLabel: 'Open panel',
  resizeHandleAriaLabel: 'Resize split panel',
};


var CryptoJS = require("crypto-js");

function Application() {

    
    //-- Add Header Cognito Token
    Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
    Axios.defaults.headers.common['x-token-cognito'] = sessionStorage.getItem("x-token-cognito");
    Axios.defaults.withCredentials = true;
  
    //-- Gather Parameters
    /*
    const [params]=useSearchParams();
    const parameter_id=params.get("id");  
    var parameter_object_bytes = CryptoJS.AES.decrypt(parameter_id, sessionStorage.getItem("x-token-cognito"));
    var parameter_object_values = JSON.parse(parameter_object_bytes.toString(CryptoJS.enc.Utf8));
    */
    
    //-- Variable for Active Tabs
    const [activeSubTabId, setActiveSubTabId] = useState("tab02-01");
    const currentSubTabId = useRef("tab02-01");
    
    
    //-- Split Panel
    const [splitPanelShow,setsplitPanelShow] = useState(false);
    const [splitPanelSize, setSplitPanelSize] = useState(400);
    const splitPanelState = useRef(false);
    
    //-- Node Identfied
    const currentClusterIdentifier = useRef("");
    
    //-- Table Nodes
    const columnsTableNodes =  [
                  {id: 'cluster_id', header: 'ClusterId',cell: item => item['cluster_id'],ariaLabel: createLabelFunction('cluster_id'),sortingField: 'cluster_id',},
                  {id: 'total_vcpu',header: 'vCPUs',cell: item => customFormatNumberLong(parseFloat(item['total_vcpu']),0),ariaLabel: createLabelFunction('total_vcpu'),sortingField: 'total_vcpu', },
                  {id: 'total_memory',header: 'Memory',cell: item => customFormatNumber(parseFloat(item['total_memory']),2),ariaLabel: createLabelFunction('total_memory'),sortingField: 'total_memory', },
                  {id: 'cpu_usage',header: 'CPU(%)',cell: item => customFormatNumberLong(parseFloat(item['cpu_usage']),2),ariaLabel: createLabelFunction('cpu_usage'),sortingField: 'cpu_usage', },
                  {id: 'memory_usage',header: 'Memory(%)',cell: item => customFormatNumberLong(parseFloat(item['memory_usage']),2),ariaLabel: createLabelFunction('memory_usage'),sortingField: 'memory_usage', },
                  {id: 'total_disk_bytes',header: 'DiskBytes',cell: item => customFormatNumberLong(parseFloat(item['total_disk_bytes']),2),ariaLabel: createLabelFunction('total_disk_bytes'),sortingField: 'total_disk_bytes', },
                  {id: 'read_bytes',header: 'IOReadBytes',cell: item => customFormatNumberLong(parseFloat(item['read_bytes']),2),ariaLabel: createLabelFunction('read_bytes'),sortingField: 'read_bytes', },
                  {id: 'write_bytes',header: 'IOWriteBytes',cell: item => customFormatNumberLong(parseFloat(item['write_bytes']),2) ,ariaLabel: createLabelFunction('write_bytes'),sortingField: 'write_bytes', },
                  {id: 'total_iops',header: 'IOPS',cell: item => customFormatNumberLong(parseFloat(item['total_iops']),2),ariaLabel: createLabelFunction('total_iops'),sortingField: 'total_iops', },
                  {id: 'io_reads',header: 'IOPSReads',cell: item => customFormatNumberLong(parseFloat(item['io_reads']),2),ariaLabel: createLabelFunction('io_reads'),sortingField: 'io_reads', },
                  {id: 'io_writes',header: 'IOPSWrites',cell: item => customFormatNumberLong(parseFloat(item['io_writes']),2) ,ariaLabel: createLabelFunction('io_writes'),sortingField: 'io_writes', },
                  {id: 'total_network_bytes',header: 'NetworkBytes',cell: item => customFormatNumberLong(parseFloat(item['total_network_bytes']),2) ,ariaLabel: createLabelFunction('total_network_bytes'),sortingField: 'total_network_bytes', },
                  {id: 'sent_bytes',header: 'NetBytesSent',cell: item => customFormatNumberLong(parseFloat(item['sent_bytes']),2) ,ariaLabel: createLabelFunction('sent_bytes'),sortingField: 'sent_bytes', },
                  {id: 'recv_bytes',header: 'NetBytesRecv',cell: item => customFormatNumberLong(parseFloat(item['recv_bytes']),2),ariaLabel: createLabelFunction('recv_bytes'),sortingField: 'recv_bytes',},
    ];
    
    const visibleContentNodes = ['cluster_id','total_vcpu','total_memory', 'cpu_usage', 'memory_usage', 'total_disk_bytes', 'total_iops', 'total_network_bytes'];
    
    
    //-- Table Steps
    const columnsTableSteps =  [
                  {id: 'clusterId', header: 'ClusterId',cell: item => item['clusterId'],ariaLabel: createLabelFunction('clusterId'),sortingField: 'clusterId',},
                  {id: 'id', header: 'JobId',cell: item => item['id'],ariaLabel: createLabelFunction('id'),sortingField: 'id',},
                  {id: 'status',header: 'State',cell: item => ( <> <StatusIndicator type={
                        item['status'] === "RUNNING" ? 'in-progress' : item['status'] === "COMPLETED" ? 'success' : item['status'] === "PENDING" ? 'pending' : 'error'
                        }> {item['status']} </StatusIndicator> </> ),ariaLabel: createLabelFunction('status'),sortingField: 'status',},
                  {id: 'name', header: 'Name',cell: item => item['name'],ariaLabel: createLabelFunction('name'),sortingField: 'name',},
                  {id: 'createdDate', header: 'CreationTime',cell: item => item['creationDateTime'],ariaLabel: createLabelFunction('createdDate'),sortingField: 'createdDate',},
                  {id: 'startedDate', header: 'StartedTime',cell: item => item['startDateTime'],ariaLabel: createLabelFunction('startedDate'),sortingField: 'startedDate',},
                  {id: 'endDate', header: 'EndTime',cell: item => item['endDateTime'],ariaLabel: createLabelFunction('endDate'),sortingField: 'endDate',},
                  {id: 'elaspsed', header: 'ElapsedTime',cell: item => customFormatDateDifference(item['startDateTime'], item['endDateTime']),ariaLabel: createLabelFunction('elaspsed'),sortingField: 'elaspsed',},
    ];
    
    const visibleContentSteps = [ 'clusterId', 'id','name', 'status', 'createdDate', 'startedDate', 'elaspsed' ];
    

    const [clusterStats,setClusterStats] = useState({
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
                                                                            totalClusters   : 0,
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
                                                                            clusters         : [],
                                                                            charts          : {
                                                                                                cpu                 : { avg : [], max : [], min : [] },
                                                                                                memory              : { avg : [], max : [], min : [] },
                                                                                                diskBytes           : { avg : [], max : [], min : [] },
                                                                                                diskIops            : { avg : [], max : [], min : [] },
                                                                                                network             : { avg : [], max : [], min : [] },
                                                                                                rolesColumn         : { series : [], categories : [] },
                                                                                                instanceTypesColumn : { series : [], categories : [] },
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
        });
    
    const [clusterSteps,setClusterSteps] = useState([]);
    
    
    
    //-- Node Stats
    const [clusterStatsDetails,setClusterStatsDetails] = useState({
                                                cpuUsage : 0,
                                                memoryUsage : 0,
                                                networkTotal : 0,
                                                diskIops : 0,
                                                charts : { 
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
                                                },
    });
    
    //-- Step Details
    const [selectedStepState,setSelectedStepState] = useState({
                                                                label: "Running",
                                                                value: "RUNNING"
    });
    
    const stepState = useRef({
                              label: "Running",
                              value: "RUNNING"
    });
    
    const stepStateOptions = [
                                { label : 'Canceled', value : 'CANCELLED' },
                                { label : 'Canceled Pending', value : 'CANCEL_PENDING' },
                                { label : 'Completed', value : 'COMPLETED' },
                                { label : 'Failed', value : 'FAILED' },
                                { label : 'Interrupted', value : 'INTERRUPTED' },
                                { label : 'Pending', value : 'PENDING' },
                                { label : 'Running', value : 'RUNNING' },
                            ];
    
    
    //-- Function Gather Cluster Stats
    async function gatherClusterStats() {
        
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
            var api_url = configuration["apps-settings"]["api-url"];
            
            var params = {
                /*
                clusterId : parameter_object_values["clusterId"],
                engineType : parameter_object_values["engine"]
                */
            };
            
            await Axios.get(`${api_url}/api/aws/emr/cluster/gather/global/live/metrics`,{
                      params: params, 
                  }).then((data)=>{
                      setClusterStats(data.data); 
                      //console.log(data.data);
            })
            .catch((err) => {
                      console.log('Timeout API Call : /api/aws/emr/cluster/gather/stats' );
                      console.log(err);
                      
            });
          
    
    }
    
    
    //-- Function Gather Cluster Stats
    async function gatherClusterStatDetails() {
        
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
            var api_url = configuration["apps-settings"]["api-url"];
            
            
            var params = {
                clusterId : currentClusterIdentifier.current,
                period : "15m"
            };
            
            await Axios.get(`${api_url}/api/aws/emr/cluster/gather/global/live/metrics/details`,{
                      params: params, 
                  }).then((data)=>{
                      console.log(data.data);
                      setClusterStatsDetails(data.data);
            })
            .catch((err) => {
                      console.log('Timeout API Call : /api/aws/emr/cluster/gather/global/live/metrics/details' );
                      console.log(err);
                      
            });
          
    
    }
    
    //-- Function Gather Cluster Steps
    async function gatherClusterSteps() {
        
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
            var api_url = configuration["apps-settings"]["api-url"];
            
            var params = {
                /*
                clusterId   : parameter_object_values["clusterId"],
                engineType  : parameter_object_values["engine"],
                state       : stepState.current.value
                */
            };
            
            await Axios.get(`${api_url}/api/aws/emr/cluster/gather/steps`,{
                      params: params, 
                  }).then((data)=>{
                      setClusterSteps(data.data.Steps);
            })
            .catch((err) => {
                      console.log('Timeout API Call : /api/aws/emr/cluster/gather/steps' );
                      console.log(err);
                      
            });
              

    }
    
    
    //-- Function Gather Cluster Information
    async function gatherClusterInformation() {
    
        await gatherClusterStats();
        
        if ( currentSubTabId.current == "tab02-05"  ) {
            //await gatherClusterSteps();
        }
    
        if ( splitPanelState.current === true  ) {
            await gatherClusterStatDetails();
        }
        
        
    }
    

   useEffect(() => {
        const id = setInterval(gatherClusterInformation, configuration["apps-settings"]["refresh-interval-emr-cluster"]);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
   
    
  return (
    <div>
      <CustomHeader/>
      <AppLayout
            disableContentPaddings
            toolsHide
            navigation={<SideNavigation activeHref={"/emr/sm-emr-ec2-multi-01"} items={SideMainLayoutMenu} header={SideMainLayoutHeader} />}
            contentType="default"
            splitPanelOpen={splitPanelShow}
            splitPanelOpen={splitPanelShow}
            onSplitPanelToggle={() => { setsplitPanelShow(false); splitPanelState.current = false; }}
            onSplitPanelResize={
                                ({ detail: { size } }) => {
                                 setSplitPanelSize(size);
                            }
            }
            splitPanelSize={splitPanelSize}
            splitPanel={
                      <SplitPanel  
                                    header={"Instance identifier : " + currentClusterIdentifier.current } 
                                    i18nStrings={splitPanelI18nStrings} 
                                    closeBehavior="hide"
                                    onSplitPanelToggle={({ detail }) => {
                                        
                                        }
                                      }
                      >
                        
                        { splitPanelShow === true  &&
                            
                            <div>  
                                <ExpandableSection defaultExpanded headerText="CPU Usage">
                                    <table style={{"width":"100%", "padding": "1em"}}>
                                        <tr>  
                                            <td style={{ "width":"15%", "text-align" : "center"}}>
                                                <ChartRadialBar01 
                                                    series={JSON.stringify([Math.round(clusterStatsDetails['cpuUsage']) || 0 ])} 
                                                    height="180px" 
                                                    title={"CPU"}
                                                />
                                            </td>
                                            <td style={{ "width":"85%", "padding-right": "2em"}}>
                                                    <ChartLine04 series={JSON.stringify([
                                                               { name : "avg", data : clusterStatsDetails['charts']?.['cpu']?.['avg'] },
                                                               { name : "max", data : clusterStatsDetails['charts']?.['cpu']?.['max'] },
                                                               { name : "min", data : clusterStatsDetails['charts']?.['cpu']?.['min'] },
                                                            ])} 
                                                            title={""} height="220px" 
                                                    />
                                            </td>
                                        </tr>
                                    </table>
                                    <br/>
                                    <br/>
                                </ExpandableSection>
                                
                                <ExpandableSection defaultExpanded headerText="Memory Usage">
                                    <table style={{"width":"100%", "padding": "1em"}}>
                                        <tr>  
                                            <td style={{ "width":"15%", "text-align" : "center"}}>
                                                <ChartRadialBar01 
                                                    series={JSON.stringify([Math.round(clusterStatsDetails['cpuUsage']) || 0 ])} 
                                                    height="180px" 
                                                    title={"Memory"}
                                                />
                                            </td>
                                            <td style={{ "width":"85%", "padding-right": "2em"}}>
                                                    <ChartLine04 series={JSON.stringify([
                                                               { name : "avg", data : clusterStatsDetails['charts']?.['memory']?.['avg'] },
                                                               { name : "max", data : clusterStatsDetails['charts']?.['memory']?.['max'] },
                                                               { name : "min", data : clusterStatsDetails['charts']?.['memory']?.['min'] },
                                                            ])} 
                                                            title={""} height="220px" 
                                                    />
                                            </td>
                                        </tr>
                                    </table>
                                    <br/>
                                    <br/>
                                
                                </ExpandableSection>
                                
                                <ExpandableSection defaultExpanded headerText="Network Throughput">
                                    <table style={{"width":"100%", "padding": "1em"}}>
                                        <tr>  
                                            <td style={{ "width":"15%", "text-align" : "center"}}>
                                                <CompMetric01 
                                                    value={clusterStatsDetails['networkTotal']|| 0}
                                                    title={"Total/sec"}
                                                    precision={0}
                                                    format={2}
                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                    fontSizeValue={"30px"}
                                                />
                                            </td>
                                            <td style={{ "width":"85%", "padding-right": "2em"}}>
                                                    <ChartLine04 series={JSON.stringify([
                                                               { name : "avg", data : clusterStatsDetails['charts']?.['network']?.['avg'] },
                                                               { name : "max", data : clusterStatsDetails['charts']?.['network']?.['max'] },
                                                               { name : "min", data : clusterStatsDetails['charts']?.['network']?.['min'] },
                                                            ])} 
                                                            title={"Network Throughput"} height="220px" 
                                                    />
                                            </td>
                                        </tr>
                                    </table>
                                    <br/>
                                    <br/>
                                </ExpandableSection>
                                
                                <ExpandableSection defaultExpanded headerText="Disk Throughput">
                                    <table style={{"width":"100%", "padding": "1em"}}>
                                        <tr>  
                                            <td style={{ "width":"15%", "text-align" : "center"}}>
                                                <CompMetric01 
                                                    value={clusterStatsDetails['diskBytes']|| 0}
                                                    title={"Total/sec"}
                                                    precision={0}
                                                    format={2}
                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                    fontSizeValue={"30px"}
                                                />
                                            </td>
                                            <td style={{ "width":"85%", "padding-right": "2em"}}>
                                                    <ChartLine04 series={JSON.stringify([
                                                               { name : "avg", data : clusterStatsDetails['charts']?.['disk']?.['avg'] },
                                                               { name : "max", data : clusterStatsDetails['charts']?.['disk']?.['max'] },
                                                               { name : "min", data : clusterStatsDetails['charts']?.['disk']?.['min'] },
                                                            ])} 
                                                            title={""} height="220px" 
                                                    />
                                            </td>
                                        </tr>
                                    </table>
                                    <br/>
                                    <br/>  
                                </ExpandableSection>
                                
                                <ExpandableSection defaultExpanded headerText="Disk IOPS">
                                    <table style={{"width":"100%", "padding": "1em"}}>
                                        <tr>  
                                            <td style={{ "width":"15%", "text-align" : "center"}}>
                                                <CompMetric01 
                                                    value={clusterStatsDetails['diskIops']|| 0}
                                                    title={"Total/sec"}
                                                    precision={0}
                                                    format={3}
                                                    fontColorValue={configuration.colors.fonts.metric100}
                                                    fontSizeValue={"30px"}
                                                />
                                            </td>
                                            <td style={{ "width":"85%", "padding-right": "2em"}}>
                                                    <ChartLine04 series={JSON.stringify([
                                                               { name : "avg", data : clusterStatsDetails['charts']?.['iops']?.['avg'] },
                                                               { name : "max", data : clusterStatsDetails['charts']?.['iops']?.['max'] },
                                                               { name : "min", data : clusterStatsDetails['charts']?.['iops']?.['min'] },
                                                            ])} 
                                                            title={""} height="220px" 
                                                    />
                                            </td>
                                        </tr>
                                    </table>
                                </ExpandableSection>
                            </div>  
                        } 
                        
                        
                    </SplitPanel>
                    
            }
            content={
                <ContentLayout disableOverlap>
                    <div style={{"padding-left" : "1em" }}>
                        <BreadcrumbGroup
                              items={[
                                { text: "EMR", href: "#" },
                                { text: "Multi-Cluster", href: "/emr/sm-emr-ec2-multi-01" },
                                { text: "Live Monitoring", href: "#" },
                              ]}
                              ariaLabel="Breadcrumbs"
                        />
                    </div>
                    <div style={{"padding" : "1em"}}>
                            <Container header={<Header variant="h2">Multi-Cluster Live Monitoring</Header>} >
                                <table style={{"width":"100%", "padding": "1em"}}>
                                    <tr>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['totalClusters']|| 0}
                                                title={"TotalClusters"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"32px"}
                                            />
                                            <br/>
                                            <br/>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['totalNodes']|| 0}
                                                title={"TotalNodes"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"32px"}
                                            />
                                            <br/>
                                            <br/>
                                            <CompMetric01 
                                                value={clusterStats['hadoop']?.['appsRunning']|| 0}
                                                title={"AppsRunning"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"32px"}
                                            />
                                            
                                        </td>
                                        <td valign="top" style={{ "width":"15%", "text-align" : "center"}}>
                                            <ChartPie01 
                                                    title={"Instances by Type"} 
                                                    height="300px" 
                                                    width="100%" 
                                                    dataset = { JSON.stringify(clusterStats['host']?.['charts']?.['instanceTypes']) }
                                            />
                                        </td>
                                        <td valign="top" style={{ "width":"15%", "text-align" : "center"}}>
                                            <ChartPie01 
                                                    title={"Instances by Purchase Option"} 
                                                    height="300px" 
                                                    width="100%" 
                                                    dataset = { JSON.stringify(clusterStats['host']?.['charts']?.['marketTypes']) }
                                            />
                                        </td>
                                        
                                        <td valign="top" style={{ "width":"15%", "text-align" : "center"}}>
                                            <ChartPie01 
                                                    title={"Instances by Node Type"} 
                                                    height="300px" 
                                                    width="100%" 
                                                    dataset = { JSON.stringify(clusterStats['host']?.['charts']?.['roles']) }
                                            />
                                            
                                        </td>
                                        <td style={{ "width":"35%", "text-align" : "center"}}>
                                            <ChartColumn01 
                                                    series={JSON.stringify(clusterStats['host']?.['charts']?.['rolesColumn']?.['series'])}
                                                    categories={JSON.stringify(clusterStats['host']?.['charts']?.['rolesColumn']?.['categories'])} 
                                                    title={"Instances by Node Type"} height="300px" 
                                            />
                                        </td>
                                        
                                    </tr>
                                </table>
                                
                                <table style={{"width":"100%", "padding": "1em"}}>
                                    <tr>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['totalVCPUs']|| 0}
                                                title={"TotalVCPUs"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['totalMemory']|| 0}
                                                title={"TotalMemory"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['cpuUsage']|| 0}
                                                title={"CPU Usage(%)"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['memoryUsage']|| 0}
                                                title={"Memory Usage(%)"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['networkTotal']|| 0}
                                                title={"Network"}
                                                precision={0}
                                                format={2}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['host']?.['diskIops']|| 0}
                                                title={"IOPS"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['hadoop']?.['appsPending']|| 0}
                                                title={"AppsPending"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['hadoop']?.['appsCompleted']|| 0}
                                                title={"appsCompleted"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                        <td style={{ "width":"10%", "text-align" : "center"}}>
                                            <CompMetric01 
                                                value={clusterStats['hadoop']?.['appsFailed']|| 0}
                                                title={"appsFailed"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"20px"}
                                            />
                                        </td>
                                    </tr>
                                </table>
                                
                            </Container>
                            <Tabs
                                disableContentPaddings
                                onChange={({ detail }) => {
                                      setActiveSubTabId(detail.activeTabId);
                                      currentSubTabId.current=detail.activeTabId;
                                      gatherClusterInformation();
                                  }
                                }
                                activeTabId={activeSubTabId}
                                tabs={[
                                  {
                                    label: "CPU Usage",
                                    id: "tab02-01",
                                    content: 
                                            <div style={{"padding-top" : "1em", "padding-bottom" : "1em"}}>
                                                <Container>
                                                        <table style={{"width":"100%", "padding": "1em"}}>
                                                            <tr>  
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <ChartRadialBar01 
                                                                        series={JSON.stringify([Math.round(clusterStats['host']?.['cpuUsage']) || 0 ])} 
                                                                        height="220px" 
                                                                        title={"CPU"}
                                                                    />
                                                                    <CompMetric01 
                                                                        value={clusterStats['host']?.['totalVCPUs']|| 0}
                                                                        title={"VCPUs"}
                                                                        precision={0}
                                                                        format={3}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"28px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <ChartRadialBar01 
                                                                        series={JSON.stringify([Math.round(clusterStats['hadoop']?.['coresUsage']) || 0 ])} 
                                                                        height="220px" 
                                                                        title={"VirtualCores"}
                                                                    />
                                                                    <CompMetric01 
                                                                        value={clusterStats['hadoop']?.['coresTotal']|| 0}
                                                                        title={"VirtualCoresTotal"}
                                                                        precision={0}
                                                                        format={3}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"28px"}
                                                                    />
                                                                </td>
                                                                
                                                                <td style={{ "width":"10%", "text-align" : "center"}}>
                                                                    <CompMetric01 
                                                                        value={clusterStats['hadoop']?.['coresAllocated']|| 0}
                                                                        title={"VirtualCoresAllocated"}
                                                                        precision={0}
                                                                        format={3}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                    <br/>
                                                                    <br/>
                                                                    <CompMetric01 
                                                                        value={clusterStats['hadoop']?.['coresAvailable']|| 0}
                                                                        title={"VirtualCoresAvailable"}
                                                                        precision={0}
                                                                        format={3}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                    <br/>
                                                                    <br/>
                                                                    <CompMetric01 
                                                                        value={clusterStats['hadoop']?.['coresReserved']|| 0}
                                                                        title={"VirtualCoresReserved"}
                                                                        precision={0}
                                                                        format={3}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"60%"}}>
                                                                        <ChartLine04 series={JSON.stringify([
                                                                                   { name : "avg", data : clusterStats['host']?.['charts']?.['cpu']?.['avg'] },
                                                                                   { name : "max", data : clusterStats['host']?.['charts']?.['cpu']?.['max'] },
                                                                                   { name : "min", data : clusterStats['host']?.['charts']?.['cpu']?.['min'] }
                                                                                ])} 
                                                                                title={"CPU Usage(%)"} height="300px" 
                                                                        />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                </Container>
                                            </div>  
                                          },
                                          {
                                            label: "Memory Usage",
                                            id: "tab02-02",
                                            content: 
                                                <div style={{"padding-top" : "1em", "padding-bottom" : "1em"}}>
                                                    <Container>
                                                        <table style={{"width":"100%", "padding": "1em"}}>
                                                            <tr>  
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <ChartRadialBar01 
                                                                        series={JSON.stringify([Math.round(clusterStats['host']?.['memoryUsage']) || 0 ])} 
                                                                        height="220px" 
                                                                        title={"Memory"}
                                                                    />
                                                                    <CompMetric01 
                                                                        value={clusterStats['host']?.['totalMemory']|| 0}
                                                                        title={"Memory"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"28px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <ChartRadialBar01 
                                                                        series={JSON.stringify([Math.round(clusterStats['hadoop']?.['memoryUsage']) || 0 ])} 
                                                                        height="220px" 
                                                                        title={"HadoopMemory"}
                                                                    />
                                                                    <CompMetric01 
                                                                        value={ clusterStats['hadoop']?.['memoryTotal'] || 0}
                                                                        title={"HadoopMemoryTotal"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"28px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"10%", "text-align" : "center"}}>
                                                                    <CompMetric01 
                                                                        value={clusterStats['hadoop']?.['memoryAllocated']|| 0}
                                                                        title={"HadoopMemoryAllocated"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                    <br/>
                                                                    <br/>
                                                                    <CompMetric01 
                                                                        value={clusterStats['hadoop']?.['memoryAvailable']|| 0}
                                                                        title={"HadoopMemoryAvailable"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                    <br/>
                                                                    <br/>
                                                                    <CompMetric01 
                                                                        value={clusterStats['hadoop']?.['memoryReserved']|| 0}
                                                                        title={"HadoopMemoryReserved"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"60%"}}>
                                                                        <ChartLine04 series={JSON.stringify([
                                                                                   { name : "avg", data : clusterStats['host']?.['charts']?.['memory']?.['avg'] },
                                                                                   { name : "max", data : clusterStats['host']?.['charts']?.['memory']?.['max'] },
                                                                                   { name : "min", data : clusterStats['host']?.['charts']?.['memory']?.['min'] }
                                                                                ])} 
                                                                                title={"Memory Usage(%)"} height="300px" 
                                                                        />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                </Container>
                                                      
                                              </div>
                                            
                                          },
                                          {
                                            label: "Network Throughput",
                                            id: "tab02-03",
                                            content: 
                                                <div style={{"padding-top" : "1em", "padding-bottom" : "1em"}}>
                                                    <Container>
                                                        <table style={{"width":"100%", "padding": "1em"}}>
                                                            <tr>  
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <CompMetric01 
                                                                        value={clusterStats['host']?.['networkTotal']|| 0}
                                                                        title={"NetworkTotal/sec"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"28px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"10%", "text-align" : "center"}}>
                                                                    <CompMetric01 
                                                                        value={clusterStats['host']?.['networkSent']|| 0}
                                                                        title={"NetworkSent/sec"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                    <br/>
                                                                    <br/>
                                                                    <CompMetric01 
                                                                        value={clusterStats['host']?.['networkRecv']|| 0}
                                                                        title={"NetworkRecv/sec"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <ChartPie01 
                                                                            title={""} 
                                                                            height="300px" 
                                                                            width="100%" 
                                                                            dataset = { JSON.stringify([
                                                                                    { name : "NetworkSent/sec", value : clusterStats['host']?.['networkSent']|| 0 },
                                                                                    { name : "NetworkRecv/sec", value : clusterStats['host']?.['networkRecv']|| 0 }
                                                                            ]) }
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"60%"}}>
                                                                    <ChartLine04 series={JSON.stringify([
                                                                               { name : "avg", data : clusterStats['host']?.['charts']?.['network']?.['avg'] },
                                                                               { name : "max", data : clusterStats['host']?.['charts']?.['network']?.['max'] },
                                                                               { name : "min", data : clusterStats['host']?.['charts']?.['network']?.['min'] }
                                                                            ])} 
                                                                            title={"Network Throughput/sec"} height="300px" 
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </Container>  
                                                      
                                              </div>
                                            
                                          },
                                          {
                                            label: "Disk Throughput",
                                            id: "tab02-04",
                                            content: 
                                                <div style={{"padding-top" : "1em", "padding-bottom" : "1em"}}>
                                                    <Container>
                                                        <table style={{"width":"100%", "padding": "1em"}}>
                                                            <tr>  
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <CompMetric01 
                                                                        value={clusterStats['host']?.['diskIops']|| 0}
                                                                        title={"IOPS"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"28px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"10%", "text-align" : "center"}}>
                                                                        <CompMetric01 
                                                                            value={clusterStats['host']?.['diskIopsReads']|| 0}
                                                                            title={"ReadIOPS"}
                                                                            precision={0}
                                                                            format={2}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"20px"}
                                                                        />
                                                                        <br/>
                                                                        <br/>
                                                                        <CompMetric01 
                                                                        value={clusterStats['host']?.['diskIopsWrites']|| 0}
                                                                        title={"WriteIOPS"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                </td>
                                                                
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <ChartPie01 
                                                                            title={""} 
                                                                            height="300px" 
                                                                            width="100%" 
                                                                            dataset = { JSON.stringify([
                                                                                    { name : "ReadIOPS", value : clusterStats['host']?.['diskIopsReads']|| 0 },
                                                                                    { name : "WriteIOPS", value : clusterStats['host']?.['diskIopsWrites']|| 0 }
                                                                            ]) }
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"60%"}}>
                                                                        <ChartLine04 series={JSON.stringify([
                                                                                   { name : "avg", data : clusterStats['host']?.['charts']?.['diskIops']?.['avg'] },
                                                                                   { name : "max", data : clusterStats['host']?.['charts']?.['diskIops']?.['max'] },
                                                                                   { name : "min", data : clusterStats['host']?.['charts']?.['diskIops']?.['min'] }
                                                                                ])} 
                                                                                title={"Disk IOPS"} height="250px" 
                                                                        />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <br/>
                                                        <br/>
                                                        <table style={{"width":"100%", "padding": "1em"}}>
                                                            <tr>  
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <CompMetric01 
                                                                        value={clusterStats['host']?.['diskBytes']|| 0}
                                                                        title={"Throughput/sec"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"28px"}
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"10%", "text-align" : "center"}}>
                                                                        <CompMetric01 
                                                                            value={clusterStats['host']?.['diskBytesReads']|| 0}
                                                                            title={"ReadThroughput/sec"}
                                                                            precision={0}
                                                                            format={2}
                                                                            fontColorValue={configuration.colors.fonts.metric100}
                                                                            fontSizeValue={"20px"}
                                                                        />
                                                                        <br/>
                                                                        <br/>
                                                                        <CompMetric01 
                                                                        value={clusterStats['host']?.['diskBytesWrites']|| 0}
                                                                        title={"WriteThroughput/sec"}
                                                                        precision={0}
                                                                        format={2}
                                                                        fontColorValue={configuration.colors.fonts.metric100}
                                                                        fontSizeValue={"20px"}
                                                                    />
                                                                </td>
                                                                
                                                                <td style={{ "width":"15%", "text-align" : "center"}}>
                                                                    <ChartPie01 
                                                                            title={""} 
                                                                            height="300px" 
                                                                            width="100%" 
                                                                            dataset = { JSON.stringify([
                                                                                    { name : "ReadThroughput", value : clusterStats['host']?.['diskBytesReads']|| 0 },
                                                                                    { name : "WriteThroughput", value : clusterStats['host']?.['diskBytesWrites']|| 0 }
                                                                            ]) }
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"60%"}}>
                                                                        <ChartLine04 series={JSON.stringify([
                                                                                   { name : "avg", data : clusterStats['host']?.['charts']?.['diskBytes']?.['avg'] },
                                                                                   { name : "max", data : clusterStats['host']?.['charts']?.['diskBytes']?.['max'] },
                                                                                   { name : "min", data : clusterStats['host']?.['charts']?.['diskBytes']?.['min'] }
                                                                                ])} 
                                                                                title={"Disk Throughput/sec"} height="250px" 
                                                                        />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </Container>
                                                      
                                              </div>
                                            
                                          },
                                          {
                                            label: "Steps",
                                            id: "tab02-05",
                                            content: 
                                                <div style={{"padding-top" : "1em", "padding-bottom" : "1em"}}>
                                                    <Container>
                                                        <ChartTimeLine01 
                                                                series={JSON.stringify(clusterStats['host']?.['charts']?.['stepsLifeCycle'])} 
                                                                title={"Steps LifeCycle"} 
                                                                height="300px" 
                                                                onClickData={(element) => {
                                                                                    console.log(element);
                                                                                }
                                                                }
                                                                toolbar={true}
                                                        />
                                                        
                                                        <CustomTable02
                                                                columnsTable={columnsTableSteps}
                                                                visibleContent={visibleContentSteps}
                                                                dataset={clusterStats['host']?.['charts']?.['stepsLifeCycle']}
                                                                title={"Steps"}
                                                                description={""}
                                                                pageSize={20}
                                                                onSelectionItem={( item ) => {
                                                                    //currentClusterIdentifier.current = item[0]?.["instance_id"];
                                                                    //setsplitPanelShow(true);
                                                                    //gatherClusterStats();
                                                                    
                                                                  }
                                                                }
                                                                extendedTableProperties = {
                                                                    { variant : "borderless" }
                                                                    
                                                                }
                                                        />
                                                        
                                                    </Container>
                                                      
                                              </div>
                                            
                                          },
                                          {
                                            label: "Instances (Hardware)",
                                            id: "tab02-06",
                                            content: 
                                                <div style={{"padding-top" : "1em", "padding-bottom" : "1em"}}>
                                                    <Container>
                                                        <table style={{"width":"100%", "padding": "1em"}}>
                                                            <tr>  
                                                                <td style={{ "width":"50%", "text-align" : "center"}}>
                                                                    <ChartColumn01 
                                                                            series={JSON.stringify(clusterStats['host']?.['charts']?.['instanceTypesColumn']?.['series'])}
                                                                            categories={JSON.stringify(clusterStats['host']?.['charts']?.['instanceTypesColumn']?.['categories'])} 
                                                                            title={"Instances by Type"} height="300px" 
                                                                    />
                                                                </td>
                                                                <td style={{ "width":"50%", "text-align" : "center"}}>
                                                                    <ChartColumn01 
                                                                            series={JSON.stringify(clusterStats['host']?.['charts']?.['instanceMarketColumn']?.['series'])}
                                                                            categories={JSON.stringify(clusterStats['host']?.['charts']?.['instanceMarketColumn']?.['categories'])} 
                                                                            title={"Instances by Purchase Option"} height="300px" 
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </Container>  
                                                      
                                              </div>
                                            
                                          },
                                        ]}
                                
                            />
                            
                            { (activeSubTabId === "tab02-01" || activeSubTabId === "tab02-02" || activeSubTabId === "tab02-03" || activeSubTabId === "tab02-04")   &&
                            
                            <Container>
                                <CustomTable02
                                        columnsTable={columnsTableNodes}
                                        visibleContent={visibleContentNodes}
                                        dataset={clusterStats['host']?.['clusters']}
                                        title={"Clusters"}
                                        description={""}
                                        pageSize={20}
                                        onSelectionItem={( item ) => {
                                                                    currentClusterIdentifier.current = item[0]?.["cluster_id"];
                                                                    splitPanelState.current = true;
                                                                    setsplitPanelShow(true);
                                                                    gatherClusterStatDetails();
                                          }
                                        }
                                        extendedTableProperties = {
                                            { variant : "borderless" }
                                            
                                        }
                                />
                            </Container>
                            }
                                
                    </div>
                
                </ContentLayout>
                
            }
            headerSelector="#h" 
        />
    </div>
  );
}

export default Application;

