import {memo} from 'react';
import Chart from 'react-apexcharts';

const ChartObject = memo(({ range, median, height, width="100%", title, border=2, onClickData = () => {}, toolbar = false }) => {
            /*  
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
            
            */
            
            //var dataset = JSON.parse(series);
            var state = {
          
            series: [
              {
                type: 'rangeArea',
                name: 'Team B Range',
                data: JSON.parse(range)
              },
              {
                type: 'line',
                name: 'Team B Median',
                data: JSON.parse(median)
              },
            ],
            options: {
              chart: {
                height: 350,
                type: 'rangeArea',
                animations: {
                  speed: 500
                }
              },
              colors: ['#33b2df','#33b2df'],
              dataLabels: {
                enabled: false
              },
              fill: {
                opacity: [0.24, 0.24, 1, 1]
              },/*
              forecastDataPoints: {
                count: 2
              },*/
              stroke: {
                curve: 'straight',
                width: [0, 2]
              },
              legend: {
                show: true,
                customLegendItems: ['Team B'],
                inverseOrder: true
              },
              title: {
                text: 'Range Area with Forecast Line (Combo)'
              },
              markers: {
                hover: {
                  sizeOffset: 5
                }
              }
            },
          
          
          };
          
          
          console.log(state);

          
          //<Chart options={options} series={[{ data: dataset }]} type="rangeBar" width={width} height={height} />
          //<ReactApexChart options={this.state.options} series={this.state.series} type="rangeArea" height={350} />
          
    return (
            <div>
                <Chart options={state.options} series={state.series} type="rangeArea" width={width} height={height} />
            </div>
           );
});

export default ChartObject;
