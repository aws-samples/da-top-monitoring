import {memo} from 'react';
import Chart from 'react-apexcharts';

const ChartColumn = memo(({ series, categories, history, height, width="100%", title, border=2, onZoom = () => {}, toolbar = false }) => {

    var options = {
              chart: {
                type: 'bar',
                height: height,
                stacked: true,
                foreColor: '#2ea597',
                toolbar: {
                  show: toolbar
                },
                zoom: {
                  enabled: true
                }
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }],
              dataLabels: {
                enabled: false
              },
              tooltip: {
                    theme: "dark",
                    x : { 
                            format: 'MM/dd HH:mm',
                    }
              },
              theme: {
                monochrome: {
                  enabled: true
                }
              },
              xaxis: {
                type: 'datetime',
                categories: JSON.parse(categories),
                labels: {
                    datetimeUTC: false,
                    style: {
                            fontSize: '11px',
                            fontFamily: 'Lato',
                    },
                }
              },
              grid: {
                show: false,
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                xaxis: {
                            lines: {
                                show: false
                            },
                        }
              },
              legend: {
                    show: true,
                    showForSingleSeries: true,
                    fontSize: '11px',
                    fontFamily: 'Lato',
              },
              title: {
                text : title,
                align: "center",
                show: true,
                style: {
                  fontSize:  '14px',
                  fontWeight:  'bold',
                  fontFamily: 'Lato',
                }
              },
              fill: {
                opacity: 1
              },
              yaxis: {
                 tickAmount: 5,
                 axisTicks: {
                      show: true,
                 },
                 axisBorder: {
                      show: true,
                      color: '#78909C',
                      offsetX: 0,
                      offsetY: 0
                 },
                 min : 0,
                 labels : {
                            formatter: function(val, index) {
                                        
                                        if(val === 0) return '0';
                                        if(val < 1000) return parseFloat(val).toFixed(1);
                                        
                                        var k = 1000,
                                        sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
                                        i = Math.floor(Math.log(val) / Math.log(k));
                                        return parseFloat((val / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        
                                        },    
                            style: {
                                  fontSize: '11px',
                                  fontFamily: 'Lato',
                             },
                 },
                 
              }
            };
            
    return (
            <div>
                <Chart options={options} series={JSON.parse(series)} type="bar" width={width} height={height} />
            </div>
           );
});

export default ChartColumn;
