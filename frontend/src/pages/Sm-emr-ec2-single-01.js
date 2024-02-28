import { useState,useEffect } from 'react'
import Axios from 'axios'
import { configuration, SideMainLayoutHeader,SideMainLayoutMenu } from './Configs';
import { createSearchParams } from "react-router-dom";

import { applicationVersionUpdate, getMatchesCountText, paginationLabels, pageSizePreference, EmptyState, customFormatDateDifference } from '../components/Functions';
import { createLabelFunction } from '../components/Functions';

import SideNavigation from '@cloudscape-design/components/side-navigation';
import AppLayout from '@cloudscape-design/components/app-layout';

import { useCollection } from '@cloudscape-design/collection-hooks';
import {CollectionPreferences,Pagination } from '@cloudscape-design/components';
import TextFilter from "@cloudscape-design/components/text-filter";

import Table from "@cloudscape-design/components/table";
import { StatusIndicator } from '@cloudscape-design/components';
import { ColumnLayout } from '@cloudscape-design/components';
import { Box } from '@cloudscape-design/components';
import Flashbar from "@cloudscape-design/components/flashbar";

import { SplitPanel } from '@cloudscape-design/components';
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import CustomHeader from "../components/Header";

import Header from "@cloudscape-design/components/header";
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


//-- Encryption
var CryptoJS = require("crypto-js");

function Application() {

    //-- Application Version
    const [versionMessage, setVersionMessage] = useState([]);
    const [clusterList, setClusterList] = useState([]);
  
    //-- Add Header Cognito Token
    Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
    Axios.defaults.headers.common['x-token-cognito'] = sessionStorage.getItem("x-token-cognito");
    Axios.defaults.withCredentials = true;
    
    //-- Split Panel
    const [splitPanelShow,setsplitPanelShow] = useState(false);
    const [splitPanelSize, setSplitPanelSize] = useState(400);
    
    
    //-- Table Variables
    
    const columnsTable = [
                  {id: 'id',header: 'ClusterId',cell: item => item['id'],ariaLabel: createLabelFunction('id'),sortingField: 'id',},
                  {id: 'name',header: 'ClusterName',cell: item => item['name'] || "-",ariaLabel: createLabelFunction('name'),sortingField: 'name',},
                  {id: 'state',header: 'State',cell: item => ( <> <StatusIndicator type={item.state === "RUNNING" || item.state === "WAITING" ? 'success' : 'pending'}> {item.state} </StatusIndicator> </> ),ariaLabel: createLabelFunction('state'),sortingField: 'state',},
                  {id: 'creationDate',header: 'CreationDate',cell: item => item['creationDate'],ariaLabel: createLabelFunction('creationDate'),sortingField: 'creationDate',},
                  {id: 'readyDate',header: 'ReadyDate',cell: item => item['readyDate'],ariaLabel: createLabelFunction('readyDate'),sortingField: 'readyDate',},
                  {id: 'endDate',header: 'TerminationDate',cell: item => item['endDate'],ariaLabel: createLabelFunction('endDate'),sortingField: 'endDate',},
                  {id: 'elaspsed', header: 'ElapsedTime',cell: item => ( customFormatDateDifference(item['creationDate'], item['endDate']) ),ariaLabel: createLabelFunction('elaspsed'),sortingField: 'elaspsed',},
                  {id: 'hours',header: 'NormalizedInstanceHours',cell: item => item['hours'],ariaLabel: createLabelFunction('hours'),sortingField: 'hours',},
    ];
    const visibleContent = ['id', 'name', 'state', 'creationDate', 'elaspsed', 'endDate', 'hours'];
    
    const [selectedItems,setSelectedItems] = useState([{ seq : "" }]);

    const visibleContentPreference = {
              title: 'Select visible content',
              options: [
                {
                  label: 'Main properties',
                  options: columnsTable.map(({ id, header }) => ({ id, label: header, editable: id !== 'id' })),
                },
              ],
    };

   const collectionPreferencesProps = {
            pageSizePreference,
            visibleContentPreference,
            cancelLabel: 'Cancel',
            confirmLabel: 'Confirm',
            title: 'Preferences',
    };
    
    
    const [preferences, setPreferences] = useState({ pageSize: 10, visibleContent: visibleContent });
    
    const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
                clusterList,
                {
                  filtering: {
                    empty: <EmptyState title="No records" />,
                    noMatch: (
                      <EmptyState
                        title="No matches"
                        action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
                      />
                    ),
                  },
                  pagination: { pageSize: preferences.pageSize },
                  sorting: {},
                  selection: {},
                }
    );
    
    

   //-- Gather Import Process
   async function gatherClusters (){
    
        try {
            
            
            var api_url = configuration["apps-settings"]["api-url"];
            var params = {};
            Axios.get(`${api_url}/api/aws/emr/cluster/list`,{
                      params: params, 
                  }).then((data)=>{
                    
                   var clusters = [];
                   data['data']?.['Clusters'].forEach(function(item) {
                        clusters.push({
                                        id : item['Id'],
                                        name : item['Name'],
                                        state : item['Status']?.['State'],
                                        creationDate : item['Status']?.['Timeline']?.['CreationDateTime'],
                                        readyDate : item['Status']?.['Timeline']?.['ReadyDateTime'],
                                        endDate : item['Status']?.['Timeline']?.['EndDateTime'],
                                        hours : item['NormalizedInstanceHours'],
                                        elapsed : customFormatDateDifference(item['Status']?.['Timeline']?.['CreationDateTime'], item['Status']?.['Timeline']?.['EndDateTime'])
                          
                        });   
                     
                   });
                   
                   setClusterList(clusters);
                   
                   if (clusters.length > 0) {
                        setSelectedItems([clusters[0]]);
                        setsplitPanelShow(true);
                   }
                   
                     
              })
              .catch((err) => {
                  console.log('Timeout API Call : /api/aws/emr/cluster/list' );
                  console.log(err);
                  
              });
            
        }
        catch{
        
          console.log('Timeout API error : /api/aws/emr/cluster/list');                  
          
        }
    
    }
    
    function onClickLive(){
        
            // Add CSRF Token
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
            
            // Select engine type
            var pathName = "/emr/sm-emr-ec2-single-03";
             
            
            var id = CryptoJS.AES.encrypt(JSON.stringify({
                                                            sessionId : sessionStorage.getItem("x-token-cognito"),
                                                            clusterId: selectedItems[0]['id'],
                                                            name: selectedItems[0]['name'],
                                                            state: selectedItems[0]['state'],
                                                            engine : "emr-ec2",
                                                            }), 
                                                            sessionStorage.getItem("x-token-cognito")
                                                            ).toString();
                                                            
            window.open( pathName + '?' + createSearchParams({
                                id: id
                                }).toString() ,'_blank');

    }
    
    
    function onClickInsight(){
        
            // Add CSRF Token
            Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
            
            // Select engine type
            var pathName = "/emr/sm-emr-ec2-single-02";
             
            
            var id = CryptoJS.AES.encrypt(JSON.stringify({
                                                              sessionId : sessionStorage.getItem("x-token-cognito"),
                                                              clusterId: selectedItems[0]['id'],
                                                              name: selectedItems[0]['name'],
                                                              state: selectedItems[0]['state'],
                                                              startDate: selectedItems[0]['creationDate'],
                                                              endDate: (selectedItems[0]['endDate'] !==undefined ? selectedItems[0]['endDate'] : new Date().toISOString()),
                                                              elapsed : selectedItems[0]['elapsed'],
                                                              engine : "emr-ec2",
                                                            }), 
                                                            sessionStorage.getItem("x-token-cognito")
                                                            ).toString();
                                                            
            window.open( pathName + '?' + createSearchParams({
                                id: id
                                }).toString() ,'_blank');

    }
    
    //-- Function Gather App Version
   async function gatherVersion (){

        //-- Application Update
        var appVersionObject = await applicationVersionUpdate({ codeId : "dbwcmp", moduleId: "elastic-m1"} );
        
        if (appVersionObject.release > configuration["apps-settings"]["release"] ){
          setVersionMessage([
                              {
                                type: "info",
                                content: "New Application version is available, new features and modules will improve workload capabilities and user experience.",
                                dismissible: true,
                                dismissLabel: "Dismiss message",
                                onDismiss: () => setVersionMessage([]),
                                id: "message_1"
                              }
          ]);
      
        }
        
   }
   
    useEffect(() => {
        gatherVersion();
        gatherClusters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    
    
    
  return (
    <div>
        <CustomHeader/>
        <AppLayout
            disableContentPaddings
            toolsHide
            navigation={<SideNavigation activeHref={"/emr/sm-emr-ec2-single-01"} items={SideMainLayoutMenu} header={SideMainLayoutHeader} />}
            contentType="default"
            splitPanelOpen={splitPanelShow}
            onSplitPanelToggle={() => setsplitPanelShow(false)}
            onSplitPanelResize={
                                ({ detail: { size } }) => {
                                 setSplitPanelSize(size);
                            }
            }
            splitPanelSize={splitPanelSize}
            splitPanel={
                      <SplitPanel  
                                    header={
                                        <Header
                                          variant="h3"
                                          actions={
                                                  <SpaceBetween
                                                    direction="horizontal"
                                                    size="xs"
                                                  >
                                                    <Button variant="primary" onClick={() => { onClickLive(); }} iconName="external" disabled={ ( String(selectedItems[0]?.['state']).includes("TERMINATE") ? true : false ) } >Live Monitoring</Button>
                                                  </SpaceBetween>
                                          }
                                          
                                        >
                                         {"Identifier : " + selectedItems[0]?.['id']}
                                        </Header>
                                    } 
                                    i18nStrings={splitPanelI18nStrings} 
                                    closeBehavior="hide"
                                    onSplitPanelToggle={({ detail }) => {
                                        
                                        }
                                      }
                      >
                            <ColumnLayout columns="4" variant="text-grid">
                             <div>
                                  <Box variant="awsui-key-label">Cluster Identifier</Box>
                                  {selectedItems[0]?.['id']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Name</Box>
                                  {selectedItems[0]?.['name']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">State</Box>
                                  {selectedItems[0]?.['state']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Ready Date</Box>
                                  {selectedItems[0]?.['readyDate']}
                              </div>
                            </ColumnLayout>
                            <br /> 
                            <br />
                            <ColumnLayout columns="4" variant="text-grid">
                              <div>
                                  <Box variant="awsui-key-label">Creation Date</Box>
                                  {selectedItems[0]?.['creationDate']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Termination Date</Box>
                                  {selectedItems[0]?.['endDate']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">Elapsed Time</Box>
                                  {selectedItems[0]?.['elapsed']}
                              </div>
                              <div>
                                  <Box variant="awsui-key-label">NormalizedInstanceHours</Box>
                                  {selectedItems[0]?.['hours']}
                              </div>
                            </ColumnLayout>
                      </SplitPanel>
            }
            content={
                
                <div style={{"padding" : "1em"}}>
                    <Table
                          {...collectionProps}
                          selectionType="single"
                          header={
                            <Header
                              variant="h2"
                              counter= {"(" + clusterList.length + ")"} 
                              actions={
                                    <SpaceBetween
                                      direction="horizontal"
                                      size="xs"
                                    >
                                      <Button variant="primary" onClick={ onClickLive } iconName="external" disabled={ ( String(selectedItems[0]?.['state']).includes("TERMINATE") ? true : false ) }>Live Monitoring</Button>
                                      <Button variant="primary" onClick={ onClickInsight } iconName="external">Insight Monitoring</Button>
                                      <Button variant="primary" onClick={() => { gatherClusters(); }}>Refresh</Button>
                                    </SpaceBetween>
                                  }
                            >
                              Clusters
                            </Header>
                          }
                          columnDefinitions={columnsTable}
                          visibleColumns={preferences.visibleContent}
                          items={items}
                          pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
                          filter={
                            <TextFilter
                              {...filterProps}
                              countText={getMatchesCountText(filteredItemsCount)}
                              filteringAriaLabel="Filter records"
                            />
                          }
                          preferences={
                            <CollectionPreferences
                              {...collectionPreferencesProps}
                              preferences={preferences}
                              onConfirm={({ detail }) => setPreferences(detail)}
                            />
                          }
                          onSelectionChange={({ detail }) => {
                              setSelectedItems(detail.selectedItems);
                              setsplitPanelShow(true);
                              }
                            }
                          selectedItems={selectedItems}
                          resizableColumns
                          stickyHeader
                          loadingText="Loading records"
                          variant="borderless" 
                          />
                </div>
                
            }
            disableContentHeaderOverlap={true}
            headerSelector="#h" 
        />
                      
    </div>
  );
}

export default Application;

