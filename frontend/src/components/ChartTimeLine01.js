import {memo} from 'react';
import Chart from 'react-apexcharts';

const ChartObject = memo(({ series, height, width="100%", title, border=2, onClickData = () => {}, toolbar = false }) => {
  
            var dataset = JSON.parse(series);
            const min = Math.min(...dataset.map(item => item.y[0]));
            const max = Math.max(...dataset.map(item => item.y[1]));
  
            var options = {
              chart: {
                height: height,
                type: 'rangeBar',
                foreColor: '#2ea597',
                toolbar: {
                  show: toolbar
                },
                events: {
                  dataPointSelection: (event, chartContext, config) => {
                    onClickData(dataset[config.dataPointIndex]?.['x']);
                  }
                },
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  distributed: true,
                  dataLabels: {
                    hideOverflowingLabels: true
                  }
                }
              },
              theme: {
                palette : "palette2"
              },
              theme: {
                monochrome: {
                  enabled: true
                }
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
              tooltip: {
                    x : { 
                            format: 'MM/dd HH:mm',
                    },
                    style: {
                      fontSize:  '11px',
                      fontWeight:  'bold',
                      fontFamily: 'Lato',
                    }
              },
              dataLabels: {
                enabled: true,
                formatter: function(val, opts) {
                  var label = opts.w.globals.labels[opts.dataPointIndex]
                  /*var a = moment(val[0])
                  var b = moment(val[1])
                  var diff = b.diff(a, 'days')
                  */
                  return label;
                  
                },
                style: {
                  colors: ['#f3f4f5', '#fff']
                }
              },
              xaxis: {
                type: 'datetime',
                min : min,
                max : max,
                labels: {
                    datetimeUTC: true,
                    style: {
                            fontSize: '11px',
                            fontFamily: 'Lato',
                    },
                }
              },
              yaxis: {
                show: false
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
            };
            
            
    return (
            <div>
                <Chart options={options} series={[{ data: dataset }]} type="rangeBar" width={width} height={height} />
            </div>
           );
});

export default ChartObject;
