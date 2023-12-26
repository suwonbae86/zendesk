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
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

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
    writeTitle
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
          type: chartType,
          label: measureLabel,
          backgroundColor:`${color_range ? colors[0] : colors[0]}`,
          borderColor: `${color_range ? colors[0] : colors[0]}`,
          pointBackgroundColor: `${color_range ? colors[0] : colors[0]}`,
          // data: data.map((row) => row[measureName].value),
          data: yAxisLeftValues ? yAxisLeftValues.split(",") : data.map((row) => row[measureName].value),
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
      if (showAllValuesInTooltip ) {
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
      }


      else {

        const pivotValue = context.tooltip.dataPoints[0].dataset.label;

        const previousPeriodValue =
          data[dataIndex][periodComparisonMeasure][pivotValue].value;
        const currentPeriodValue = context.tooltip.dataPoints[0].raw as number;

        const hasPreviousPeriod =
          hasPeriodComparisonMeasure && !!previousPeriodValue;
        const periodComparisonValue =
          ((currentPeriodValue - previousPeriodValue) / previousPeriodValue) *
          100;

        rows = [
          {
            hasPreviousPeriod,
            measureValue: `${
              context.tooltip.dataPoints[0].formattedValue
            }`,


            periodComparisonValue,
            pivotColor: context.tooltip.dataPoints[0].dataset
              .borderColor as string,
            pivotText: context.tooltip.dataPoints[0].dataset.label,
          },
        ];
      }

      setTooltip({
        dimensionLabel0: `${dimensionLabel}:`,
        dimensionLabel: `${context.tooltip.title[0]}`,
        measureLabel: `${context.tooltip.dataPoints[0].dataset.label}: `,
        // measureLabel: `${yAxisLeftValues}: `,
        measureLabel0: `${context.tooltip.dataPoints[0].formattedValue}`,
        left:
          position.left + window.pageXOffset + context.tooltip.caretX  - 160 + "px",
        rows,
        top:
          position.top +
          window.pageYOffset +
          context.tooltip.caretY - 200 + "px",
        yAlign: context.tooltip.yAlign,
      });

    } else {
      setTooltip(null);
    }
  }


      const Content = config.textTitle.split(",").map((d, i) => ({
      textTitle: d,
      yAxisDropdown:config.yAxisDropdown.split(",")[i],
      // xAxisDropdown:config.xAxisDropdown.split(",")[i],

      symbol:config.symbol.split(",")[i],
      yAxisLeftValues:config.yAxisLeftValues.split(",")[i],
      yAxisRightDropdown:config.yAxisRightDropdown.split(",")[i],

      // yAxisRightValues:config.yAxisRightValues.split(",")[i],
      // symbol2:config.symbol2.split(",")[i],

      }))



      let title = Content.map(function(val, i){ return val.textTitle });

      let title = title[0]


      let percent = Content.map(function(val, i){ return val.yAxisDropdown });

      let percent = Math.round(percent[0] * 100)


let result = Content.map(function(val, i){ return val.symbol });

let target = Math.round(result[0] * 100)




let yAxisRightDropdownValues = Content.map(function(val, i){ return val.yAxisRightDropdown });


let yAxisRightDropdownValues = Math.round(yAxisRightDropdownValues[0])



const first = labels[0];
const last = labels[labels.length - 1];


  const chartOptions: ChartOptions<"scatter" | "bar"> = useMemo(
    () => ({
      layout: {
        padding: {
          top: 10,
          right:10,
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
        legend: {
          position: "bottom",
          labels: {
            color:'#262D33',
            font: {
              size: 10,
              weight: '500',
              family: "Roboto"

            },
          usePointStyle: true
         },
        align: "center" as const,
        display: false,
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
            display: showXGridLines,
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

          display:false,
          maxTicksLimit: 2,
          autoSkip: true,

          callback: () => {

            return labels[0];
            return labels[labels.length - 1];
          },

            font: {
              size: 10
            },
            color: 'black',
          },
        },

        yLeft: {
          border: {
          display: false,
        },
          grid: {
            display: showYGridLines,
          },
          position: "left" as const,
          stacked: false,
          ticks: {
            display:false,
            callback: function (value: number) {
              return `${formatNumber(value)}`;
            },
          },
          title: {
            display: false,
            // text: `${yAxisDropdown ?  yAxisDropdownValues  : measureLabel }`,
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
    <div className="greenBox pt-3">
    <h5 className="mb-3">{writeTitle === "" ? title : writeTitle}</h5>
          {/*<p>Number of accounts without activity in the last 30 days</p>*/}
    </div>

    <div className={target < 0 ? "varianceBox negative" : "varianceBox positive"}>

    <h1 className="mb-0">{percent}
    <span class="caret">
    </span>
      </h1>
   <h3 className={hideTarget ? "hidden" : ""}>Target: {target}</h3>


    </div>
    <div id="vis-wrapper" className={`${config.showPoints ? "points hidePoints" : "points"}`}>

      <div id="chart-wrapper">
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
      <div className="showFirstLast">
        <p>{first}</p>
        <p>{last}</p>
      </div>
          <div className="bottom">
          <p>L13W Avg</p>
          <p>{yAxisRightDropdownValues}</p>
          </div>
    </div>
    </div>
    </div>

  );
}

export default BarLineVis;
