import {useState,useEffect,useRef} from 'react'
import ReactLoading from "react-loading";
import Axios from 'axios'
import { configuration, SideMainLayoutHeader,SideMainLayoutMenu } from './Configs';

import { createLabelFunction, customFormatNumberLong, customFormatNumber, customFormatDateDifference,  customDateDifferenceMinutes } from '../components/Functions';

import ContentLayout from '@cloudscape-design/components/content-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Header from "@cloudscape-design/components/header";
import { SplitPanel } from '@cloudscape-design/components';
import AppLayout from '@cloudscape-design/components/app-layout';
import SpaceBetween from "@cloudscape-design/components/space-between";
import Container from "@cloudscape-design/components/container";
import CustomHeader from "../components/Header";
import Button from "@cloudscape-design/components/button";
import Multiselect from "@cloudscape-design/components/multiselect";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";

import CompMetric01  from '../components/Metric01';
import ChartDots01  from '../components/ChartDots01';
import CustomTable02 from "../components/Table02";
import ChartPie01 from '../components/ChartPie-01';
import ChartColumn01  from '../components/ChartColumn01';
import DateTimePicker01 from "../components/DateTimePicker01";
import ChartTimeLine01  from '../components/ChartTimeLine01';
import ChartRadialBar02 from '../components/ChartRadialBar02';


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



function Application() {

    //-- Add Header Cognito Token
    Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
    Axios.defaults.headers.common['x-token-cognito'] = sessionStorage.getItem("x-token-cognito");
    Axios.defaults.withCredentials = true;
  

    //-- Split Panel
    const [splitPanelShow,setsplitPanelShow] = useState(false);
    const [splitPanelSize, setSplitPanelSize] = useState(400);
    const splitPanelState = useRef(false);
    
    //-- Node Identfied
    const currentInstanceIdentifier = useRef("");
    
    //-- Table Nodes
    const columnsTableClusters =  [
                  {id: 'cluster_id', header: 'ClusterId',cell: item => item['cluster_id'],ariaLabel: createLabelFunction('cluster_id'),sortingField: 'cluster_id',},
                  {id: 'nodes_total',header: 'Nodes',cell: item => customFormatNumberLong(parseFloat(item['nodes_total']),0),ariaLabel: createLabelFunction('nodes_total'),sortingField: 'nodes_total', },
                  {id: 'cpu_total',header: 'CPUs',cell: item => customFormatNumberLong(parseFloat(item['cpu_total']),0),ariaLabel: createLabelFunction('cpu_total'),sortingField: 'cpu_total', },
                  {id: 'memory_total',header: 'Memory',cell: item => customFormatNumber(parseFloat(item['memory_total']),2),ariaLabel: createLabelFunction('memory_total'),sortingField: 'memory_total', },
                  {id: 'cpu_usage_avg',header: 'CPU Avg(%)',cell: item => customFormatNumberLong(parseFloat(item['cpu_usage_avg']),2),ariaLabel: createLabelFunction('cpu_usage_avg'),sortingField: 'cpu_usage_avg', },
                  {id: 'cpu_usage_p10',header: 'CPU p10(%)',cell: item => customFormatNumberLong(parseFloat(item['cpu_usage_p10']),2),ariaLabel: createLabelFunction('cpu_usage_p10'),sortingField: 'cpu_usage_p10', },
                  {id: 'cpu_usage_p50',header: 'CPU p50(%)',cell: item => customFormatNumberLong(parseFloat(item['cpu_usage_p50']),2),ariaLabel: createLabelFunction('cpu_usage_p50'),sortingField: 'cpu_usage_p50', },
                  {id: 'cpu_usage_p90',header: 'CPU p90(%)',cell: item => customFormatNumberLong(parseFloat(item['cpu_usage_p90']),2),ariaLabel: createLabelFunction('cpu_usage_p90'),sortingField: 'cpu_usage_p90', },
                  {id: 'memory_usage_avg',header: 'Memory Avg(%)',cell: item => customFormatNumberLong(parseFloat(item['memory_usage_avg']),2),ariaLabel: createLabelFunction('memory_usage_avg'),sortingField: 'memory_usage_avg', },
                  {id: 'memory_usage_p10',header: 'Memory p10(%)',cell: item => customFormatNumberLong(parseFloat(item['memory_usage_p10']),2),ariaLabel: createLabelFunction('memory_usage_p10'),sortingField: 'memory_usage_p10', },
                  {id: 'memory_usage_p50',header: 'Memory p50(%)',cell: item => customFormatNumberLong(parseFloat(item['memory_usage_p50']),2),ariaLabel: createLabelFunction('memory_usage_p50'),sortingField: 'memory_usage_p50', },
                  {id: 'memory_usage_p90',header: 'Memory p90(%)',cell: item => customFormatNumberLong(parseFloat(item['memory_usage_p90']),2),ariaLabel: createLabelFunction('memory_usage_p90'),sortingField: 'memory_usage_p90', },
    ];
    
    const visibleContentClusters = ['cluster_id','nodes_total', 'cpu_total', 'cpu_usage_avg', 'cpu_usage_p10', 'cpu_usage_p50', 'cpu_usage_p90', 'memory_total', 'memory_usage_avg', 'memory_usage_p10', 'memory_usage_p50', 'memory_usage_p90' ];
    
    
    const [globalStats,setGlobalStats] = useState({
                                                        totalClusters   : 0,
                                                        totalCPUs       : 0,
                                                        totalMemory     : 0,
                                                        totalNodes      : 0,
                                                        cpuUsage        : { avg : 0, p10 : 0, p50 : 0, p90 : 0 },
                                                        memoryUsage     : { avg : 0, p10 : 0, p50 : 0, p90 : 0 },
                                                        clusters        : [],
                                                        charts : {
                                                            clusters        : [],
                                                            cores           : [],
                                                            cpus            : [],
                                                            memory          : [],
                                                            jobsRunning     : [],
                                                            clusterLifeCycle : [],
                                                            cpuUsage        : { p10 : [], p50 : [], p90 : [] } ,
                                                            memoryUsage     : { p10 : [], p50 : [], p90 : [] } ,
                                                            coresUsage      : { p10 : [], p50 : [], p90 : [] } ,
                                                            roles           : { categories : [], series : [] },
                                                            instanceType    : { categories : [], series : [] },
                                                            instanceMarket  : { categories : [], series : [] }, 
                                                            globalInstanceType : [],
                                                            globalInstanceMarket : [],
                                                            globalInstanceRole : [],
                                                        }
        });
    
    
    var dateFilter = useRef({ type: "absolute", "startDate" : new Date((new Date).getTime() - 24 * 60 * 60 * 1000).toISOString(),  "endDate" : new Date().toISOString() });
    
    const [selectedOptions,setSelectedOptions] = useState([
                                                            { label: "Clusters Details", value: "1"},
                                                            { label: "Clusters LifeCycle", value: "2"},
                                                            { label: "Clusters Running", value: "3"},
                                                            { label: "Cores Total", value: "4"},
                                                            { label: "Cores Usage(%)", value: "5"},
                                                            { label: "CPU Usage(%)", value: "6"},
                                                            { label: "Instance Distribution", value: "7"},
                                                            { label: "Instances by Class", value: "8"},
                                                            { label: "Instances by Market", value: "9"},
                                                            { label: "Instances by Role", value: "10"},
                                                            { label: "Jobs Running", value: "11"},
                                                            { label: "Memory Total(GB)", value: "12"},
                                                            { label: "Memory Usage(%)", value: "13"},
                                                            { label: "Resource Usage", value: "14"},
    ]);
    
    const [requestInProgress,setRequestInProgress] = useState(false);
    
    
    
    
    //-- Function Gather Cluster Stats
    async function gatherGlobalStats() {
        
            setRequestInProgress(true);
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
            var api_url = configuration["apps-settings"]["api-url"];
            var startDate = (dateFilter.current['startDate'].substring(0,19)).replace("T", " ");
            var endDate = (dateFilter.current['endDate'].substring(0,19)).replace("T", " ");
            var periodHours = customDateDifferenceMinutes(startDate,endDate) / 60 ;
            var period = "";
            
            switch (true) {
                
                case (periodHours < 24 ):
                    period = "5m";
                    break;
                    
                case (periodHours < ( 24 * 3)):
                    period = "10m";
                    break;
                    
                case (periodHours < ( 24 * 7)):
                    period = "60m";
                    break;
                    
                case (periodHours < ( 24 * 14)):
                    period = "360m";
                    break;
                    
                case (periodHours < ( 24 * 21)):
                    period = "720m";
                    break;
                    
                case (periodHours < ( 24 * 28)):
                    period = "1d";
                    break;
                    
                default:
                    period = "3d";
                    break;
            }
            
            var params = {
                period : period,
                filter : " time between timestamp '" + startDate + "' and timestamp '" + endDate + "'",
            };
            
            
            await Axios.get(`${api_url}/api/aws/emr/cluster/gather/global/metrics`,{
                      params: params, 
                  }).then((data)=>{
                      setGlobalStats(data.data); 
                      setRequestInProgress(false);
            })
            .catch((err) => {
                      console.log('Timeout API Call : /api/aws/emr/cluster/gather/global/metrics' );
                      console.log(err);
                      
            });
          
    
    }
    
    
   
   useEffect(() => {
        gatherGlobalStats();
    }, []);
    
    
    function chartSelected(element,arr) {
          return arr.some(function(el) {
            return el.label === element;
          }); 
    }
    
    
  return (
    <div>
      <CustomHeader/>
      <AppLayout
            navigation={<SideNavigation activeHref={"/emr/sm-emr-ec2-03"} items={SideMainLayoutMenu} header={SideMainLayoutHeader} />}
            toolsHide
            contentType="default"
            content={
                <ContentLayout disableOverlap>
                            <BreadcrumbGroup
                                  items={[
                                    { text: "EMR", href: "#" },
                                    { text: "Clusters", href: "/emr/clusters" },
                                    { text: "Dashboard", href: "#"}
                                  ]}
                                  ariaLabel="Breadcrumbs"
                            />
                            <br/>
                            <Container
                                header={
                                        <Header
                                          variant="h2"
                                          actions={
                                            <SpaceBetween
                                              direction="horizontal"
                                              size="xs"
                                            >
                                                { requestInProgress === true  &&
                                                    <ReactLoading
                                                          type={"bars"}
                                                          color={"#1ab7ea"}
                                                          height={"35px"}
                                                          width={"35px"}
        
                                                    />
                                                }
                                                <DateTimePicker01
                                                      value={dateFilter.current}
                                                      onChangeDateSelection={(detail) => {
                                                                dateFilter.current = detail;
                                                                gatherGlobalStats();
                                                      }
                                                      }
                                                />
                                                <Button variant="primary"
                                                        onClick={() => {
                                                                            gatherGlobalStats();
                                                                        }
                                                        }
                                                >Refresh</Button>
                                            </SpaceBetween>
                                          }
                                        >
                                          Summary
                                        </Header>
                                      }
                            >
                                <br/>
                                <ColumnLayout columns={4} variant="text-grid">
                                      <div>
                                        <CompMetric01 
                                                value={globalStats['totalClusters']|| 0}
                                                title={"TotalClusters"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"32px"}
                                        />
                                      </div>
                                      <div>
                                            <CompMetric01 
                                                value={globalStats['totalNodes']|| 0}
                                                title={"TotalNodes"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"32px"}
                                            />
                                      </div>
                                      <div>
                                            <CompMetric01 
                                                value={globalStats['totalCPUs']|| 0}
                                                title={"TotalVCPUs"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"32px"}
                                            />
                                      </div>
                                      <div>
                                            <CompMetric01 
                                                value={globalStats['totalMemory']|| 0}
                                                title={"TotalMemory(GB)"}
                                                precision={0}
                                                format={3}
                                                fontColorValue={configuration.colors.fonts.metric100}
                                                fontSizeValue={"32px"}
                                            />
                                      </div>
                                </ColumnLayout>
                                <br/>
                                <ExpandableSection headerText="Widget Selection">
                                    <table style={{"width":"100%", "padding": "1em"}}>
                                        <tr>  
                                            <td style={{ "width":"100%", "text-align" : "center"}}>
                                    
                                                <Multiselect
                                                      selectedOptions={selectedOptions}
                                                      onChange={({ detail }) =>
                                                        setSelectedOptions(detail.selectedOptions)
                                                      }
                                                      options={[
                                                        { label: "Clusters Details", value: "1"},
                                                        { label: "Clusters LifeCycle", value: "2"},
                                                        { label: "Clusters Running", value: "3"},
                                                        { label: "Cores Total", value: "4"},
                                                        { label: "Cores Usage(%)", value: "5"},
                                                        { label: "CPU Usage(%)", value: "6"},
                                                        { label: "Instance Distribution", value: "7"},
                                                        { label: "Instances by Class", value: "8"},
                                                        { label: "Instances by Market", value: "9"},
                                                        { label: "Instances by Role", value: "10"},
                                                        { label: "Jobs Running", value: "11"},
                                                        { label: "Memory Total(GB)", value: "12"},
                                                        { label: "Memory Usage(%)", value: "13"},
                                                        { label: "Resource Usage", value: "14"},
                                                      ]}
                                                      placeholder="Choose Widgets"
                                                    />
                                    
                                            </td>
                                        </tr>
                                    </table>   
                                </ExpandableSection>
                            </Container>
                            <br/>
                            
                            { chartSelected("Instance Distribution",selectedOptions) === true  &&
                                <div>
                                    <Container
                                            header={
                                                <Header
                                                  variant="h2"
                                                >
                                                  Instance Distribution
                                                </Header>
                                                }
                                    >
                                        <br/>
                                        <ColumnLayout columns={3} variant="text-grid">
                                            <div>
                                                <ChartPie01 
                                                        title={"Instances by Type"} 
                                                        height="300px" 
                                                        width="100%" 
                                                        dataset = { JSON.stringify(globalStats['charts']?.['globalInstanceType']) }
                                                />
                                            </div>
                                            <div>
                                                <ChartPie01 
                                                        title={"Instances by Market"} 
                                                        height="300px" 
                                                        width="100%" 
                                                        dataset = { JSON.stringify(globalStats['charts']?.['globalInstanceMarket']) }
                                                />
                                            </div>
                                            <div>
                                              <ChartPie01 
                                                        title={"Instances by Role"} 
                                                        height="300px" 
                                                        width="100%" 
                                                        dataset = { JSON.stringify(globalStats['charts']?.['globalInstanceRole']) }
                                                />
                                            </div>
                                        </ColumnLayout>
                                    </Container>
                                    <br/>
                                </div>
                            }
                            
                            { chartSelected("Resource Usage",selectedOptions) === true  &&
                                <div>
                                    <ColumnLayout columns={2}>
                                        <Container
                                                header={
                                                    <Header
                                                      variant="h2"
                                                    >
                                                      CPU Usage(%)
                                                    </Header>
                                                    }
                                        >
                                            <br/>
                                            <ChartRadialBar02 
                                                        title={""} 
                                                        height="300px" 
                                                        width="100%" 
                                                        labels = {JSON.stringify(['Average','P10', 'P50','P90'])}
                                                        series = {JSON.stringify([
                                                                                    Math.round(globalStats['cpuUsage']?.['avg']),
                                                                                    Math.round(globalStats['cpuUsage']?.['p10']),
                                                                                    Math.round(globalStats['cpuUsage']?.['p50']),
                                                                                    Math.round(globalStats['cpuUsage']?.['p90']),
                                                        ])}
                                            />
                                        </Container>
                                        
                                        <Container
                                                header={
                                                    <Header
                                                      variant="h2"
                                                    >
                                                      Memory Usage(%)
                                                    </Header>
                                                    }
                                        >
                                            <br/>
                                            <ChartRadialBar02 
                                                        title={""} 
                                                        height="300px" 
                                                        width="100%" 
                                                        labels = {JSON.stringify(['Average', 'P10', 'P50', 'P90'])}
                                                        series = {JSON.stringify([
                                                                                    Math.round(globalStats['memoryUsage']?.['avg']),
                                                                                    Math.round(globalStats['memoryUsage']?.['p10']),
                                                                                    Math.round(globalStats['memoryUsage']?.['p50']),
                                                                                    Math.round(globalStats['memoryUsage']?.['p90']),
                                                        ])}
                                            />
                                        </Container>
                                    </ColumnLayout>
                                    <br/>
                                </div>
                            }
                            { chartSelected("Clusters Details",selectedOptions) === true  &&
                                <div>
                                    <Container
                                            header={
                                                <Header
                                                  variant="h2"
                                                >
                                                  Cluster Details
                                                </Header>
                                                }
                                    >
                                        <br/>
                                        <CustomTable02
                                                columnsTable={columnsTableClusters}
                                                visibleContent={visibleContentClusters}
                                                dataset={globalStats['clusters']}
                                                title={"Clusters"}
                                                description={""}
                                                pageSize={20}
                                                onSelectionItem={( item ) => {
                                                        //currentInstanceIdentifier.current = item[0]?.["instance_id"];
                                                        //splitPanelState.current = true;
                                                        //setsplitPanelShow(true);
                                                        //gatherNodeStats();
                                                  }
                                                }
                                                extendedTableProperties = {
                                                    { variant : "borderless" }
                                                }
                                        />
                                        
                                    </Container>
                                    <br/>
                                </div>
                            }
                            { chartSelected("Clusters LifeCycle",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Clusters LifeCycle
                                                        </Header>
                                                        }
                                    >  
                                        <ChartTimeLine01 
                                                series={JSON.stringify(globalStats['charts']?.['clusterLifeCycle'])} 
                                                title={""} 
                                                height="300px" 
                                                onClickData={(element) => {
                                                                    console.log(element);
                                                                }
                                                }
                                                toolbar={true}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                            }
                            
                            { chartSelected("Instances by Role",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Instances by Role
                                                        </Header>
                                                        }
                                    >  
                                        <ChartColumn01 
                                                series={JSON.stringify(globalStats['charts']?.['roles']?.['series'])}
                                                categories={JSON.stringify(globalStats['charts']?.['roles']?.['categories'])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                            }
                                
                            { chartSelected("Instances by Class",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Instances by Class
                                                        </Header>
                                                        }
                                    >  
                                        <ChartColumn01 
                                                series={JSON.stringify(globalStats['charts']?.['instanceType']?.['series'])}
                                                categories={JSON.stringify(globalStats['charts']?.['instanceType']?.['categories'])} 
                                                title={"Instances by Class"} height="300px" 
                                                toolbar={true}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                            }
                                
                                
                            { chartSelected("Instances by Market",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Instances by Market
                                                        </Header>
                                                        }
                                    >  
                                        <ChartColumn01 
                                                series={JSON.stringify(globalStats['charts']?.['instanceMarket']?.['series'])}
                                                categories={JSON.stringify(globalStats['charts']?.['instanceMarket']?.['categories'])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                        />
                                    </Container>  
                                    <br/>
                                    </div>
                                }
                            
                            { chartSelected("Clusters Running",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Clusters Running
                                                        </Header>
                                                        }
                                    >  
                                        <ChartDots01 series={JSON.stringify([
                                                   { name : "clusters", data : globalStats['charts']?.['clusters'] }
                                                ])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                            }
                            
                            { chartSelected("CPU Usage(%)",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          CPU Usage(%)
                                                        </Header>
                                                        }
                                    >  
                                        <ChartDots01 series={JSON.stringify([
                                                   { name : "p10", data : globalStats['charts']?.['cpuUsage']?.['p10'] },
                                                   { name : "p50", data : globalStats['charts']?.['cpuUsage']?.['p50'] },
                                                   { name : "p90", data : globalStats['charts']?.['cpuUsage']?.['p90'] },
                                                ])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                                ymax={100}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                            }    
                            
                            
                            
                            { chartSelected("Cores Total",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Cores Total
                                                        </Header>
                                                        }
                                    >  
                                        <ChartDots01 series={JSON.stringify([
                                                   { name : "cores", data : globalStats['charts']?.['cores'] }
                                                ])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                        />
                                        </Container>  
                                    <br/>
                                </div>
                                }
                                
                                
                                { chartSelected("Cores Usage(%)",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Cores Usage(%)
                                                        </Header>
                                                        }
                                    >  
                                        <ChartDots01 series={JSON.stringify([
                                                   { name : "p10", data : globalStats['charts']?.['coresUsage']?.['p10'] },
                                                   { name : "p50", data : globalStats['charts']?.['coresUsage']?.['p50'] },
                                                   { name : "p90", data : globalStats['charts']?.['coresUsage']?.['p90'] },
                                                ])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                                ymax={100}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                                }
                                
                                
                                { chartSelected("Jobs Running",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Jobs Running
                                                        </Header>
                                                        }
                                    >
                                        <ChartDots01 series={JSON.stringify([
                                                   { name : "jobs", data : globalStats['charts']?.['jobsRunning'] }
                                                ])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                                }
                                
                                
                                { chartSelected("Memory Total(GB)",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Memory Total(GB)
                                                        </Header>
                                                        }
                                    >
                                        <ChartDots01 series={JSON.stringify([
                                                   { name : "memory", data : globalStats['charts']?.['memory'] }
                                                ])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                                }
                                
                                { chartSelected("Memory Usage(%)",selectedOptions) === true  &&
                                <div>
                                    <Container header={
                                                        <Header
                                                          variant="h2"
                                                        >
                                                          Memory Usage(%)
                                                        </Header>
                                                        }
                                    >
                                        <ChartDots01 series={JSON.stringify([
                                                   { name : "p10", data : globalStats['charts']?.['memoryUsage']?.['p10'] },
                                                   { name : "p50", data : globalStats['charts']?.['memoryUsage']?.['p50'] },
                                                   { name : "p90", data : globalStats['charts']?.['memoryUsage']?.['p90'] },
                                                ])} 
                                                title={""} 
                                                height="300px" 
                                                toolbar={true}
                                                ymax={100}
                                        />
                                    </Container>  
                                    <br/>
                                </div>
                                }
                            
                </ContentLayout>
            }
            headerSelector="#h" 
        />
    </div>
  );
}

export default Application;

