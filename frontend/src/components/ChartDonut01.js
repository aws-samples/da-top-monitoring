import {memo} from 'react';
import Chart from 'react-apexcharts';

const ChartDonut = memo(({series, labels, height, width="100%", title = ""}) => {
    var options = {
              chart: {
                type: 'donut',
                height: height,
                foreColor: '#9e9b9a',
                animations: {
                    enabled: true,
                },
              },
              legend: {
                position: 'bottom'
              },
              stroke: {
                  show: false,
                  width:0
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }],
              fill: {
                  type: "gradient",
                  gradient: {
                    type: "vertical",
                    shadeIntensity: 0.5,
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 2,
                    stops: [0, 100]
                  }
              },
              plotOptions: {
                donut: {
                  inverseOrder: false,
                  hollow: {
                    margin: 5,
                    size: "48%",
                    background: "transparent"
                  },
                  track: {
                    show: true,
                    background: "#40475D",
                    strokeWidth: "1%",
                    opacity: 1,
                    margin: 3 
                  }
                }
              },
              title: {
                text : title,
                align: "center",
                show: false,
                style: {
                  fontSize:  '13px',
                  fontWeight:  'bold',
                  fontFamily:  undefined,
                }
              },
              labels: JSON.parse(labels)
            };
            
    return (
            <div>
                <Chart options={options} series={JSON.parse(series)} type="donut" width={width} height={height} />
            </div>
           );
});

export default ChartDonut;
