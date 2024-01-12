import {
  Fields,
  Link,
  LookerChartUtils,
  TooltipData,
  TooltipRow,
  VisConfig,
  VisData,
} from "../types";
import React, { useEffect, useMemo, useState } from "react";

import { formatNumber, formatNumber2 } from "../utils";
import {
  Chart as ChartJS,
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip as ChartJsTooltip,
  LineController,
  BarController,
  ScatterController,
  ChartType,
  ChartOptions,
  Filler,
  ChartData,
  Point,
  BubbleDataPoint,
  ChartTypeRegistry,
  TooltipModel,
} from "chart.js";
import Tooltip from "./Tooltip";
import { Chart } from "react-chartjs-2";
import "bootstrap/scss/bootstrap.scss";
// import Button from "react-bootstrap/Button";

import { Button, Overlay, OverlayTrigger, Popover, PopoverBody, PopoverHeader} from 'react-bootstrap';


import ButtonGroup from "react-bootstrap/ButtonGroup";
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(
  LinearScale,
  ArcElement,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  ChartJsTooltip,
  LineController,
  BarController,
  Filler,
  ScatterController,
  ChartDataLabels
);



interface BarLineVisProps {
  data: VisData;
  fields: Fields;
  config: VisConfig;
  lookerCharts: LookerChartUtils;
  lookerVis?: any;
  configOptions: configOptions

}

const chartPlugins = [
  {
    id: "padding-below-legend",
    beforeInit(chart: any) {
      // Get a reference to the original fit function
      const originalFit = chart.legend.fit;

      chart.legend.fit = function fit() {

        originalFit.bind(chart.legend)();
        this.height += 10;
      };
    },
  },
];


ChartJS.defaults.font.family = "Roboto";
ChartJS.defaults.font.size = 13;
ChartJS.defaults.color = "#262D33";




function BarLineVis({
  data,
  fields,
  config,
  lookerCharts,
  lookerVis,
  configOptions
}: BarLineVisProps): JSX.Element {


  // config values
  const {
    isYAxisCurrency,
    showXGridLines,
    showYGridLines,
    showXAxisLabel,
    xAxisText,
    showYAxisLabel,
    yAxisText,
    textTitle,
    showKpi,
    kpiUnit,
    isStacked,
    showLineChartGradient,
    showAllValuesInTooltip,
    showPoints,
    xAxisDropdown,
    yAxisDropdown,
    symbol,
    symbol2,
    showYAxis2,
    yAxisRightDropdown,
    showYAxis2Value,
    yAxisRightValues,
    isYAxisCurrency2,
    choosePoints,
    color_range,
    yAxisLeftValues,
    firstmeasure,
    borderLine,
    hideTarget,
    writeTitle,
    showDatalabels,
    writeTooltip,
    toolOn,
    showX,
    showTwo,
    hideBox,
    hideColors,
    hideBottom,
    writeTarget,
    color_title,
    lastBar,
    titleColor,
    firstmeasure,
    fieldOptions0,
    sign,
    kpiField,
    dollar,
    percentSign,
    xFontSize,
    yFontSize,
    legendSize,
    diagonal,
    changeLegend
  } = config;



  // Chart type toggle
  interface ChartTypeOption {
    label: string;
    value: ChartType;
  }

  const chartTypeOptions: ChartTypeOption[] = [
    {
      label: "Bar",
      value: "bar",
    },

  ];

  const [selectedChartType, setSelectedChartType] = useState(
    chartTypeOptions[0].value
  );

  // map Looker query data to ChartJS data format
  const dimensionName = fields.dimensions[0];
  const measureName = fields.measures[0];
  const previousPeriodFieldName = fields.measures[0];

  const dimensionLabel = fields.dimensionsLabel[0];
  const measureLabel = fields.measuresLabel[0];






  const [firstData = {}] = data;
  let cols_to_hide = [];

  for (const [key, value] of Object.entries(firstData)) {
    if (key.split(".")[1] === "currency_number_format") {
      cols_to_hide = firstData[key].value.split(",").map((e) => e.trim());

    }
  }


  let points = [];

  for (const [key, value] of Object.entries(firstData)) {
    if (key.split(".")[1] === "points_sized_by") {
      points = firstData[key].value.split(",").map((e) => e.trim());

    }
  }
  let points = points.toString()

  let text = cols_to_hide.toString()


  const labels = data.map(
    (row) => row[dimensionName].rendered ?? row[dimensionName].value ?? "∅"
  );



  const colors = config.color_range

  const background = config.color_title


  const hasPivot = !!fields.pivots && fields.pivots.length > 0;

  const hasNoPivot = !!fields.pivots && fields.pivots.length === 0;

  const fill = showLineChartGradient ? "origin" : false;

  const defaultChartData: ChartData<
  | "bar"
  | "line"
  | "scatter"
  | "bubble"
  | "pie"
  | "doughnut"
  | "polarArea"
  | "radar",
  (number | Point | [number, number] | BubbleDataPoint)[],
  any
  > = {
    labels,
    datasets: [],
  };
  const [chartData, setChartData] = useState(defaultChartData);

  function updateChartData(chartType: ChartType) {
    let datasets = [];
    let canvasElement = document.getElementById("chart") as HTMLCanvasElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext("2d");


      if (hasPivot) {
        const pivotValues = Object.keys(data[0][measureName]);

        pivotValues.forEach((pivotValue, i) => {
          const columnData = data.map(
            (row) => row[measureName][pivotValue].value
          );


          datasets.push({
            datalabels: {
              color:  `${color_range ? colors[i] : colors[i]}`,
              fontWeight:'600'
            },
            labels:pivotValues,
            type: chartType,
            label: pivotValue,
            // barThickness: 75,
            backgroundColor:`${color_range ? colors[i] : colors[i]}`,
            borderColor: `${color_range ? colors[0] : colors[0]}`,
            pointBackgroundColor: `${color_range ? colors[0] : colors[0]}`,
            data: columnData,
            yAxisID: "yLeft",
            yAxisID: "yRight",
            fill,
          });


        });
      }
      else {


        datasets.push({
          datalabels: {
            color: "black !important",
            fontWeight:'600',

          },

          type: chartType,
          label: `${changeLegend ? changeLegend : measureLabel}`,
          backgroundColor: lastBar ? color_range ? colors[0] : colors[0] : data.map((item, index) => { return index === data.length - 1 ? colors[1] : colors[0]}),
          //backgroundColor:`${color_range ? colors[0] : colors[0]}`,
          borderColor: `${color_range ? colors[0] : colors[0]}`,
          pointBackgroundColor: `${color_range ? colors[0] : colors[0]}`,
          data: yAxisValues,
          // data: yAxisLeftValues ? yAxisLeftValues.split(",") : data.map((row) => row[measureName].value),
          yAxisID: "yLeft",
          fill,
        });
      }
      setChartData({ labels, datasets });
    }
  }

  useEffect(() => {
    updateChartData(selectedChartType);
  }, []);

  // chart tooltip
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const hasPeriodComparisonMeasure = fields.measures.length > 1;
  const periodComparisonMeasure = fields.measures[1];



  interface TooltipContext {
    chart: ChartJS<
    keyof ChartTypeRegistry,
    (number | Point | [number, number] | BubbleDataPoint)[],
    unknown
    >;
    tooltip: TooltipModel<"bar" | "scatter">;
  }

  function tooltipHandler(
    context: TooltipContext,


    setTooltip: (newState: TooltipData | null) => void
  ) {
    const isTooltipVisible = context.tooltip.opacity !== 0;
    if (isTooltipVisible) {
      const position = context.chart.canvas.getBoundingClientRect();


      const { dataIndex } = context.tooltip.dataPoints[0];


      const lookerRow = data[dataIndex];


      let rows: TooltipRow[] = [];
      // if (showAllValuesInTooltip ) {
        Object.entries(lookerRow[measureName]).forEach(

          ([pivotName, { value: currentPeriodValue }], i) => {

            const previousPeriodValue =
            lookerRow[previousPeriodFieldName][pivotName].value;

            const hasPreviousPeriod =
            hasPeriodComparisonMeasure && !!previousPeriodValue;
            const periodComparisonValue =
            ((currentPeriodValue - previousPeriodValue) /
            previousPeriodValue) *
            100;



            rows.push({
              hasPreviousPeriod,

              measureValue: `${currentPeriodValue}`,

              periodComparisonValue,
              pivotColor: `#${colors[i]}`,
              pivotText: pivotName,


            });


          }
        );
      // }


      // else {
      //
      //   const pivotValue = context.tooltip.dataPoints[0].dataset.label;
      //
      //   const previousPeriodValue =
      //   data[dataIndex][periodComparisonMeasure][pivotValue].value;
      //   const currentPeriodValue = context.tooltip.dataPoints[0].raw as number;
      //
      //   const hasPreviousPeriod =
      //   hasPeriodComparisonMeasure && !!previousPeriodValue;
      //   const periodComparisonValue =
      //   ((currentPeriodValue - previousPeriodValue) / previousPeriodValue) *
      //   100;
      //
      //   rows = [
      //     {
      //       hasPreviousPeriod,
      //       measureValue: `${
      //         context.tooltip.dataPoints[0].formattedValue
      //       }`,
      //
      //
      //       periodComparisonValue,
      //       pivotColor: context.tooltip.dataPoints[0].dataset
      //       .borderColor as string,
      //       pivotText: context.tooltip.dataPoints[0].dataset.label,
      //     },
      //   ];
      // }

      setTooltip({
        dimensionLabel0: `${dimensionLabel}:`,
        dimensionLabel: `${context.tooltip.title[0]}`,
        measureLabel: `${context.tooltip.dataPoints[0].dataset.label}: `,



        // measureLabel: `${yAxisLeftValues}: `,
        measureLabel0: `${context.tooltip.dataPoints[0].formattedValue}`,
        left:
            position.left + window.pageXOffset + context.tooltip.caretX + "px",
            rows,
            top:
              position.top +
              window.pageYOffset +
              context.tooltip.caretY -
              20 +
              "px",
            yAlign: context.tooltip.yAlign,
          });

    } else {
      setTooltip(null);
    }
  }


  const Content = config.textTitle.split(",").map((d, i) => ({
    textTitle: d,
    // yAxisDropdown:config.yAxisDropdown.split(",")[i],

    symbol:config.symbol.split(",")[i],
    // yAxisLeftValues:config.yAxisLeftValues.split(",")[i],


  }))



  const yAxisValues = data.map(item => item[yAxisLeftValues].value)



  var total = 0;
  for(var i = 0; i < yAxisValues.length; i++) {
      total += yAxisValues[i];
  }
  var avg = total / yAxisValues.length;


let array = yAxisValues




function calculateAverage(array) {
let num = 0;
for (let i = 0; i < yAxisValues.length; i++) {
   // console.log(yAxisValues[i]);

 num += +yAxisValues[i];
   console.log(yAxisValues.length)
}
return num / yAxisValues.length

}

var average = calculateAverage(array);

// console.log(average)

var average = Math.round(average * 1).toLocaleString();

// console.log(average)

  let title = Content.map(function(val, i){ return val.textTitle });

  let title = title[0]


  let percent = Content.map(function(val, i){ return val.yAxisDropdown });

  let percent = Math.round(percent[0] * 100)


  let result = Content.map(function(val, i){ return val.symbol });

  let target = Math.round(result[0] * 100)

  let yAxisRightDropdownValues = Content.map(function(val, i){ return val.yAxisRightDropdown });


  let yAxisRightDropdownValues = Math.round(yAxisRightDropdownValues[0])


  const first = labels[0];
  const lastLabel = labels[labels.length - 1];



  let array2 = yAxisDropdown.split(',').map(function(item) {
      return parseInt(item);
  });





  const yDrop = data.map(item => item[yAxisDropdown].value)

  const last = yDrop[yDrop.length - 1];


  // const last = Math.round(last * 1).toLocaleString();
  //
  //
  // console.log(last)

// var labels = [first, lastLabel]
// console.log(thing)
//
// console.log(labels)

  const popoverHoverFocus = (
    <Popover
    className={toolOn ? "" : "hidden"}
    id="popover"
    >
    <p>{writeTooltip}</p>
    </Popover>
  );

  const chartOptions: ChartOptions<"scatter" | "bar"> = useMemo(
    () => ({
      layout: {
        padding: {
          top: 30,
          right:10,
          left: 10,
          bottom:0

        },
      },

      onClick: (event, elements, chart) => {


        if (!elements.length) {
          return;
        }
        const { datasetIndex, index: dataIndex } = elements[0];

        if (hasPivot) {

          const measureLinks = Object.values(data[dataIndex][measureName])[datasetIndex].links ?? [];
          const dimensionLinks = (data[dataIndex][dimensionName].links as Link[]) ?? [];

        }
        else{
          const measureLinks = data[dataIndex][measureName].links ?? [];

          const dimensionLinks = (data[dataIndex][dimensionName].links) ?? [];
        }

        lookerCharts.Utils.openDrillMenu({
          links: [...measureLinks, ...dimensionLinks],
          event: event.native,
        });
      },
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        datalabels: {

          display: showDatalabels ?  "auto" : false,
          // display: function(context) {
          //   return context.dataIndex % 2; // display labels with an odd index
          // },

          formatter: function(value: number) {


          // if (value < 1){
          //
          //   return Math.round(value*100)
          // }
         if  (value < 100){

            return Math.round(value*1)
          }
          else if (value < 1000){

          return Math.round(value*1)
        }
          else{
              // return `${formatNumber(Math.round(value).toFixed(0) * 1) }`;

              let percentage = (value) / 1000

              return `${formatNumber(Math.round(percentage.toFixed() * 1000))}`;
          }
        },
          // formatter: function(value: number) {
          //
          //   return `${formatNumber(Math.round(value).toFixed(0) * 1) }`;
          //
          //   // let percentage = (value) / 1000
          //   //
          //   // return `${formatNumber(Math.round(percentage.toFixed() * 1000))}`;
          // },
          font: {
            size: 10,
            weight: '500',
            family: "Roboto",

          },


          anchor: 'end',
          align: 'end',


        },
        legend: {
          position: "bottom",
          labels: {
            color:'#262D33',
            font: {
              size: `${legendSize ?  legendSize  : 10 }`,
              weight: '500',
              family: "Roboto"

            },
            usePointStyle: true
          },
          align: "center" as const,
          display: `${showXGridLines ? hasNoPivot || hasPivot : ""}`
        },
        tooltip: {
          enabled: false,
          position: "nearest",
          external: (context) =>
          tooltipHandler(context, setTooltip),
        },
      },
      scales: {
        x: {
          border: {
            display: false,
          },

          grid: {
            display: false,
          },
          stacked: false,
          title: {
            display: false,
            // text: ` ${xAxisDropdown ?  xAxisDropdownValues  : dimensionLabel }`,
            font: {
              size: 10
            }
          },
          ticks: {


            display: showTwo || showX ? true : false,


            // `${showX  ? true : false  : showTwo  ? true : false : false}`,

              autoSkip: `${diagonal ?  true : false }`,
              maxRotation: `${diagonal ?  60  : 0 }`,
              minRotation: `${diagonal ?  60  : 0 }`,



            maxTicksLimit: `${showTwo ?  1 : 5000}`,
            autoSkip: `${showTwo ?  true : false}`,
            minRotation:`${showTwo ?  0 : 0}`,


            // callback: () => {
            //
            //   return labels[0];
            //   // return labels[labels.length - 1];
            // },



            font: {
              size:`${xFontSize ?  xFontSize  : 10 }`
            },
            color: 'black',
          },
        },

        yLeft: {
          border: {
            display: false,
          },
          grid: {
            display: false,
          },
          position: "left" as const,
          stacked: false,
          ticks: {
            font: {
              size: `${yFontSize ?  yFontSize  : 10 }`
            },
            display:showYGridLines,
            callback: function (value: number) {
              return `${formatNumber(value)}`;
            },
          },
          title: {
            display: false,
            // text: `${showYGridLines ?  yAxisRightDropdownValues  : measureLabel }`,
            font: {
              size: 10
            }
          },

        },

      },
    }),
    []
  );




  // KPI value
  const kpiValue = data.reduce((total, currentRow) => {
    let newTotal = total;
    if (hasPivot) {
      const cellValues = Object.values(currentRow[measureName]).map(
        (cell) => cell.value
      );
      for (let i = 0; i < cellValues.length; i++) {
        newTotal += cellValues[i];
      }
    } else {
      newTotal += currentRow[measureName].value;
    }

    return newTotal;
  }, 0);

  function handleChartTypeSelection(newChartType: ChartType) {
    setSelectedChartType(newChartType);
    updateChartData(newChartType);
  }

  return (

    <div>




    <div className={borderLine ?  "upDown noBorder"  : "upDown"}>
    <div className="greenBox pt-3" style={{ backgroundColor: color_title ? background[0] : '#00363d'}}>


    <h5 className="mb-3" style={{ color: titleColor ? titleColor : '#fff'}}>{writeTitle === "" ? title : writeTitle}</h5>
    {/*<p>Number of accounts without activity in the last 30 days</p>*/}
    </div>

    <div className={`
      ${last > 0 ? "varianceBox negative" : "varianceBox positive"}
      ${hideColors ? "varianceBox clear" : ""}
      ${hideBox ? "visibilityHidden" : ""}
      `}>


    <OverlayTrigger

      trigger="hover"
      placement="right"
      overlay={popoverHoverFocus}
    >
      <h1 className="mb-0">{dollar ? "$" : ""}{Math.round(last * 1).toLocaleString()}{percentSign ? "%" : ""}
      <span class="caret">
      </span>
      </h1>
    </OverlayTrigger>

    <h3 className={hideTarget ? "hidden" : ""}>Target: {writeTarget === "" ? target : writeTarget}</h3>


    </div>
    <div id="vis-wrapper" className={`${config.showPoints ? "points hidePoints" : "points"}`}>

    <div
    id="chart-wrapper"
    className={hideBox ? "tallerBox" : ""}>
    <Chart
    type={selectedChartType}
    data={chartData}
    options={chartOptions}
    id="chart"

    plugins={chartPlugins}

    lookerVis={lookerVis}
    />
    {tooltip && <Tooltip hasPivot={hasPivot} hasNoPivot={hasNoPivot} tooltipData={tooltip} />}
    </div>
    <div className={`${showTwo ? "showFirstLast" : "showFirstLast colorWhite"}`}>
    <p className="hidden">{first}</p>
    <p className={showXGridLines ? "rightP" : "rightP moveDown"}>{lastLabel}</p>
    </div>
    <div className={hideBottom ? "bottom hideBottom" : "bottom"}>
    <p>L13W Avg</p>
    <p>{average}</p>
    </div>
    </div>
    </div>
    </div>

  );
}

export default BarLineVis;
