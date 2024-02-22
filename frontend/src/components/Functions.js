import { configuration } from '../pages/Configs';
import { createSearchParams } from "react-router-dom";
import Box from "@awsui/components-react/box";

export async function applicationVersionUpdate(params) {
        var version = await gatherVersionJsonFile(params);
        return version;
}



//-- Version Functions
const gatherVersionJsonFile = async (params) => {
    var json = { release : "0.0.0", date : "2023-09-01"}
    try {
        const response = await fetch(configuration["apps-settings"]["version-code-url"] 
        + '?' + createSearchParams({
                                codeId: params.codeId,
                                moduleId: params.moduleId
                                }).toString()
        );
        json = await response.json();
    }
    catch{
        
    }
    return(json);
}



//-- Version Functions
export const gatherLocalVersion = async () => {
    var json = { release : "0.0.0", date : "2023-09-01"}
    try {
        const response = await fetch("./version.json");
        json = await response.json();
    }
    catch{
        
    }
    return(json);
}



export class classLogging {

        properties;
        constructor(object) { 
            this.properties = {...object};
        }
          
          
        //-- Open Connection
        write(module,type,message) { 
            var timestamp = new Date();
            console.log({ time : timestamp.toTimeString().split(' ')[0],
                           type : type,
                           object : this.properties.name,
                           instance : this.properties.instance,
                           module : module,
                           message : message
                        });
        }
}


//--++ Custom Format Functions

export function customFormatNumber(value,decimalLength) {
        if(value == 0) return '0';
        if(value < 1024) return parseFloat(value).toFixed(decimalLength);
        
        var k = 1024,
        sizes = ['', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(value) / Math.log(k));
        return parseFloat((value / Math.pow(k, i)).toFixed(decimalLength)) + ' ' + sizes[i];
}

export function customFormatNumberLong(value,decimalLength) {
        if(value == 0) return '0';
        if(value < 1000) return parseFloat(value).toFixed(decimalLength);
        
        var k = 1000,
        sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        i = Math.floor(Math.log(value) / Math.log(k));
        return parseFloat((value / Math.pow(k, i)).toFixed(decimalLength)) + ' ' + sizes[i];
}


export function customFormatNumberShort(value,decimalLength) {
        
        if (value < 100 && decimalLength == 0 )
          decimalLength=2;

        if (value==0)
          decimalLength=0;

        return value.toLocaleString('en-US', {minimumFractionDigits:decimalLength, maximumFractionDigits:decimalLength}); 

}


export function customFormatDateDifference(startDate, endDate) {
    
        if (startDate !== undefined) {
            
            var endDateValue;
        
            if (endDate === undefined) {
                endDateValue = new Date().valueOf();
            }
            else{
                endDateValue = new Date(endDate).valueOf();
            }
    
            let diffTime = Math.abs(new Date(startDate).valueOf() - endDateValue);
            let days = diffTime / (24*60*60*1000);
            let hours = (days % 1) * 24;
            let minutes = (hours % 1) * 60;
            let secs = (minutes % 1) * 60;
            [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]
    
            return ( String(days) + 'd' + " "  + String(hours) +'h' + " " + String(minutes) +'m' + " " + String(secs) +'s' );
            
        }
        else 
            return "";
}
    


export function customStatusStep(value) {
        
        var result = "";
        switch(value) {
            case "RUNNING" :
                    result = " in-progress";
                    break;
                
        }
        console.log(result);
        return result;
}
    
    
    
    
export class classMetrics {

          #objLog = new classLogging({ name : "classMetrics", instance : "generic" });
          //-- Constructor method
          constructor(object) { 
                    this.metricList = {};
                    this.metricDictionary=object.metrics;
                    this.totalSnaps = 0;
                    
                    this.currentObject = {};
                    this.oldObject = {};
                    
                    object.metrics.forEach(metric => {
                        this.metricList =  {...this.metricList, [metric.name]: { name : metric.name, label : metric.label, value : 0, type : metric.type, history : metric.history, data : Array(metric.history).fill(null), timestamp: "" } }
                        
                    });
                    
                    
          }
          
         
          
          
          //-- Update values after snapshot
          #updateData(){
              
            try {
                
        
                for (let metric of Object.keys(this.metricList)) {
                    
                        
                        switch(this.metricList[metric].type){
                            
                            case 1 :         
                                if (  (this.currentObject[metric] - this.oldObject[metric]) > 0)
                                    this.metricList[metric].value = ( 
                                                    (
                                                            (this.currentObject[metric] - this.oldObject[metric]) / 
                                                            (Math.abs(this.currentTime - this.oldTime) / 1000)
                                                    ) || 0
                                    );
                                else 
                                    this.metricList[metric].value = 0;
                                
                                this.metricList[metric].data.push(this.metricList[metric].value);
                                this.metricList[metric].data = this.metricList[metric].data.slice(this.metricList[metric].data.length-this.metricList[metric].history);
                        
                                break;
                            
                            case 2: 
                                this.metricList[metric].value = this.currentObject[metric];
                                this.metricList[metric].data.push(this.metricList[metric].value);
                                this.metricList[metric].data = this.metricList[metric].data.slice(this.metricList[metric].data.length-this.metricList[metric].history);
                                
                                break;
                            
                            
                            case 3:
                                this.metricList[metric].value = this.currentObject[metric];
                                if ( this.metricList[metric].timestamp != this.currentTime){
                                            this.metricList[metric].data.push(this.metricList[metric].value);
                                            this.metricList[metric].data = this.metricList[metric].data.slice(this.metricList[metric].data.length-this.metricList[metric].history);
                                            this.metricList[metric].timestamp = this.currentTime;
                                }
                                break;
                                
                            case 4:
                                this.metricList[metric].value = this.currentObject[metric];
                                break;
                                
                                
                            case 5: 
                                if ( this.currentObject[metric + "Timestamp"] != this.oldObject[metric + "Timestamp"]) {
                                    this.metricList[metric].value = this.currentObject[metric];
                                    this.metricList[metric].data.push(this.metricList[metric].value);
                                    this.metricList[metric].data = this.metricList[metric].data.slice(this.metricList[metric].data.length-this.metricList[metric].history);
                                }
                                
                                break;
                                        
                            
                        }
                       
                }
            
            }
            catch(err){
                
                this.#objLog.write("#updateData","err",err)
                
            }
           
              
          }
          
          //-- Take new snapshot
          newSnapshot(currentObject,currentTime) {
                    
                    this.oldObject = this.currentObject;
                    this.oldTime = this.currentTime;
                    
                    this.currentObject = currentObject;
                    this.currentTime = currentTime;
                    this.totalSnaps++;
                    if (this.totalSnaps > 2)
                        this.#updateData();
                        
          }
          
          
          setItemValue(itemName,itemValue) {
                    this.metricList[itemName].value = itemValue;
                    if ( this.metricList[itemName].type == 1 ||  this.metricList[itemName].type == 2){
                        this.metricList[itemName].data.push(this.metricList[itemName].value);
                        this.metricList[itemName].data = this.metricList[itemName].data.slice(this.metricList[itemName].data.length-this.metricList[itemName].history);
                    }
          }
          
          
          setItemValueCustom(itemName,itemValue) {
                if ( this.metricList[itemName].type == 3 || this.metricList[itemName].type == 4 || this.metricList[itemName].type == 5 ){
                    this.metricList[itemName].value = itemValue;
                    this.metricList[itemName].data.push(this.metricList[itemName].value);
                    this.metricList[itemName].data = this.metricList[itemName].data.slice(this.metricList[itemName].data.length-this.metricList[itemName].history);
                }
          }
          
          getItemValue(itemName) {
                  return this.metricList[itemName].value;
          }
          
          getItemValueTimestamp(itemName) {
                if (this.metricList[itemName].type == 5 &&  this.totalSnaps > 1 )
                    return this.currentObject[itemName+"Timestamp"];
                else
                    return null;
                    
          }
          
          getItem(itemName) {
                  return { value : this.metricList[itemName].value , history : { name : itemName, data : this.metricList[itemName].data } };
          }
          
                   
          
          getMetricList(){
              
            try {
              
                var metrics = {};
                var history = {};
                for (let metric of Object.keys(this.metricList)) {
                    metrics = { ...metrics, [metric] : this.metricList[metric].value };
                    history = { ...history, [metric] : { name : metric, data : this.metricList[metric].data } }
                };
                
                return { ...metrics, history : history };
            
            }
            catch(err){
                this.#objLog.write("getMetricList","err",err)
            }
                
          }
          
          getMetricDictionary(){
           
             return this.metricDictionary;
                
          }

}


//-- Functions to Format Date

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatDateLong(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    'T' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}


//-- Date Difference Function
export function customDateDifferenceMinutes(startDate, endDate){
    
            var diff = Math.abs(new Date(startDate) - new Date(endDate));
            return (Math.floor((diff/1000)/60));
            
}
        

//--## Table Functions and Variable


export function getMatchesCountText(count) {
  return count === 1 ? `1 match` : `${count} matches`;
}



export function formatDate(date) {
  const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
  const timeFormatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short', hour12: false });
  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}



export function createLabelFunction(columnName) {
  return ({ sorted, descending }) => {
    const sortState = sorted ? `sorted ${descending ? 'descending' : 'ascending'}` : 'not sorted';
    return `${columnName}, ${sortState}.`;
  };
}



export const paginationLabels = {
  nextPageLabel: 'Next page',
  pageLabel: pageNumber => `Go to page ${pageNumber}`,
  previousPageLabel: 'Previous page',
};




export const pageSizePreference = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 resources' },
    { value: 20, label: '20 resources' },
  ],
};



export function EmptyState({ title, subtitle, action }) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      <Box variant="p" padding={{ bottom: 's' }} color="inherit">
        {subtitle}
      </Box>
      {action}
    </Box>
  );
}