import {memo} from 'react';
import Chart from 'react-apexcharts';

const ChartRadial = memo(({  labels, series , height, width, title, fontSizeTitle = "11px", fontSizeValue = "22px", fontColorTitle = "#C6C2C1", fontColorValue = "orange" }) => {
    
   
      var state = {
            series: JSON.parse(series),
            options: {
              chart: {
                height: 390,
                type: 'radialBar',
                foreColor: '#9e9b9a',
              },
              title: {
                text : title,
                align: "center",
                show: false,
                style: {
                  fontSize:  '14px',
                  fontWeight:  'bold',
                  fontFamily: 'Lato',
                }
                
              },
              plotOptions: {
                radialBar: {
                  offsetY: 0,
                  startAngle: 0,
                  endAngle: 270,
                  hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                  },
                  dataLabels: {
                    name: {
                      show: false,
                    },
                    value: {
                      show: false,
                    }
                  }
                }
              },
              colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
              labels: JSON.parse(labels),
              legend: {
                show: true,
                floating: true,
                fontSize: '12px',
                position: 'left',
                offsetX: 50,
                //offsetY: 15,
                labels: {
                  useSeriesColors: true,
                },
                markers: {
                  size: 0
                },
                formatter: function(seriesName, opts) {
                  return seriesName + " :  " + opts.w.globals.series[opts.seriesIndex] 
                },
                itemMargin: {
                  vertical: 3
                }
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  legend: {
                      show: false
                  }
                }
              }]
            },
          };
      
    return (
            <div>
                <div style={{height:height, width:width}}>
                    <Chart options={state.options} series={state.series} type={"radialBar"} width={width} height={height} />
                </div>
            </div>
          
           );
});

export default ChartRadial;
