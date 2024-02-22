import {memo} from 'react';
import Chart from 'react-apexcharts';

const ChartDonut = memo(({series, labels, height, width="100%", title}) => {
  
  /*
  
  var optionsCircle = {
  chart: {
    type: "radialBar",
    height: 250,
    offsetX: 0
  },
  plotOptions: {
    radialBar: {
      inverseOrder: false,
      hollow: {
        margin: 5,
        size: "48%",
        background: "transparent"
      },
      track: {
        show: true,
        background: "#40475D",
        strokeWidth: "10%",
        opacity: 1,
        margin: 3 // margin is in pixels
      }
    }
  },
  series: [71, 63],
  labels: ["Device 1", "Device 2"],
  legend: {
    show: true,
    position: "left",
    offsetX: -30,
    offsetY: -10,
    formatter: function (val, opts) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex] + "%";
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      shadeIntensity: 0.5,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  }
};


  */
  
    var options = {
              chart: {
                type: 'radialBar',
                height: height,
                foreColor: '#9e9b9a',
                animations: {
                    enabled: true,
                }
              },
              plotOptions: {
                radialBar: {
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
                    margin: 3 // margin is in pixels
                  },
                  dataLabels: {
                        show: true,
                        value: {
                                show: true,
                              },
                  }
                }
              },
              legend: {
                show: true,
                position: "bottom"
              },
              fill: {
                  type: "gradient",
                  gradient: {
                    type: "horizontal",
                    shadeIntensity: 0.5,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                  }
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
              labels: JSON.parse(labels)
            };
            
    return (
            <div>
                <Chart options={options} series={JSON.parse(series)} type="radialBar" width={width} height={height} />
            </div>
           );
});

export default ChartDonut;
