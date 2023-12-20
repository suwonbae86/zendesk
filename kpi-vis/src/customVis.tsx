import "./style.css";
import { Looker } from "./types";
import { createRoot } from "react-dom/client";
import React, { useEffect, useMemo, useState } from "react";
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
import { Doughnut, Bar } from "react-chartjs-2";
import { UpArrowSVG, DownArrowSVG, SECTIONS } from "./utils";

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


// Global values provided via the API
declare var looker: Looker;

const gaugeChartOptions: ChartOptions<"bar"> = {
  // cutout: "75%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
};

interface DataValues {
  kpiValue: string;
  comparisonValue: string;
  comparisonValueRaw: number;
  gaugeValue: number;
}

interface KpiVisProps {
  dataValues: DataValues;
  isPeriodComparisonVisible: boolean;
  isGaugeVisible: boolean;
  kpiLabel: string;
  targetNumber:number;
  kpiValueUnit: string;
  comparisonLabel: string;
}

function KpiVis({
  dataValues,
  isPeriodComparisonVisible,
  isGaugeVisible,
  kpiLabel,
  targetNumber,
  kpiValueUnit,
  comparisonLabel,
}: KpiVisProps): JSX.Element {
  const { kpiValue, comparisonValue, comparisonValueRaw, gaugeValue } =
    dataValues;

  const isPeriodComparisonPositive =
    !!comparisonValueRaw && comparisonValueRaw > 0;
  const isPeriodComparisonNegative =
    !!comparisonValueRaw && comparisonValueRaw < 0;

  // Gauge data
  const gaugeValueRounded = Math.round(gaugeValue * 100);
  const gaugeColor = gaugeValueRounded >= 50 ? "#4837B9" : "#C7200A";
  const gaugeData: ChartData<"bar", number[], unknown> = {
    datasets: [
      {
        data: [gaugeValueRounded, 100 - gaugeValueRounded],
        backgroundColor: [gaugeColor, "#EBEBFF"],
      },
    ],
  };


  const chartTypeOptions: ChartTypeOption[] = [
    {
      label: "Bar",
      value: "bar",
    },

  ];

  const [selectedChartType, setSelectedChartType] = useState(
    chartTypeOptions[0].value
  );

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

    datasets: [],
  };
  const [chartData, setChartData] = useState(defaultChartData);

    function updateChartData(chartType: ChartType) {
      let datasets = [];
      let canvasElement = document.getElementById("chart") as HTMLCanvasElement;
      if (canvasElement) {
        const ctx = canvasElement.getContext("2d");

        datasets.push({
          type: "bar",
          label: "hi",
          backgroundColor:"green",
          borderColor:"green",
          pointBackgroundColor: "green",
             borderWidth: 2,
          // data: data.map((row) => row[measureName].value),
          data: [10, 20, 30, 40, 50, 60, 70, 10, 20, 30, 40, 50, 60, 70],

          yAxisID: "yLeft",

        });


      }
      setChartData({ datasets });
    }


  useEffect(() => {
    updateChartData(selectedChartType);
  }, []);

  // chart tooltip
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);


  const chartOptions: ChartOptions<"scatter" | "bar"> = useMemo(
    () => ({
      layout: {
        padding: {
          top: 15,
          left:10,
        },
      },
      //
      // onClick: (event, elements, chart) => {
      //
      //   if (!elements.length) {
      //     return;
      //   }
      //   const { datasetIndex, index: dataIndex } = elements[0];
      //
      //   if (hasPivot) {
      //
      //   const measureLinks = Object.values(data[dataIndex][measureName])[datasetIndex].links ?? [];
      //   const dimensionLinks = (data[dataIndex][dimensionName].links as Link[]) ?? [];
      //
      // }
      // else{
      //   const measureLinks = data[dataIndex][measureName].links ?? [];
      //
      //   const dimensionLinks = (data[dataIndex][dimensionName].links) ?? [];
      // }
      //
      //   lookerCharts.Utils.openDrillMenu({
      //     links: [...measureLinks, ...dimensionLinks],
      //     event: event.native,
      //   });
      // },
      plugins: {
        legend: {
          position: "bottom",

        align: "center" as const,
        display:false
        // display: hasNoPivot || hasPivot,
        },
        // tooltip: {
        //   enabled: false,
        //   position: "nearest",
        //   external: (context) =>
        //     tooltipHandler(context, isYAxisCurrency, setTooltip),
        // },
      },
      scales: {
        x: {

          grid: {
            display: false,
          },
          stacked: false,
          title: {
            display: false,
            text: "hi",
            font: {
              size: 14
            }
          },
        },

        yLeft: {
          grid: {
            display: false,
          },
          position: "left" as const,
          stacked: false,
          ticks: {
            display:true,
            // callback: function (value: number) {
            //   return `${symbol ? theSymbol : text}${formatNumber(value)}`;
            // },
          },
          title: {
            display:false,
            text: "hi",
            font: {
              size: 14
            }
          },

        },



      },
    }),
    []
  );


  return (
    <div>

    <div class="upDown">

<div className="greenBox">
  <div id="kpi-label">{kpiLabel}</div>
      <p>Number of accounts without activity in the last 30 days</p>
</div>
    <div id="vis-wrapper">




      <div id="left-side">


        {isPeriodComparisonVisible && (
          <div id="kpi-change-wrapper">
            <div
              className={`change-value-wrapper ${
                isPeriodComparisonPositive
                  ? "positive-background"
                  : isPeriodComparisonNegative
                  ? "negative-background"
                  : ""
              }`}
            >
              <h2>{comparisonValue}
              {isPeriodComparisonPositive && <UpArrowSVG />}
              {isPeriodComparisonNegative && <DownArrowSVG />}
              <span
                className={`change-value ${
                  isPeriodComparisonPositive
                    ? "positive-text"
                    : isPeriodComparisonNegative
                    ? "negative-text"
                    : ""
                }`}
              ></span></h2>
              <h3>Target: 0</h3>


            </div>
            {/*<span id="change-label">{comparisonLabel}</span>*/}
          </div>
        )}
      </div>

    </div>
    <div id="right-side" style={{marginTop:"10px"}}>


            <Bar
            data={chartData}
            options={chartOptions}
            id="chart"
            />

      </div>

      <div id="between">
      <p>L13W Avg</p>
      <p>{kpiValue}</p>
        </div>
    </div>


    </div>
  );
}

looker.plugins.visualizations.add({
  // The create method gets called once on initial load of the visualization.
  // It's just a convenient place to do any setup that only needs to happen once.
  create: function (element, config) {},

  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {
    // get query fields
    const { measure_like: measureLike } = queryResponse.fields;
    interface Measure {
      label: string;
      name: string;
    }
    const measures: Measure[] = measureLike.map((measure) => ({
      label: measure.label_short ?? measure.label,
      name: measure.name,
    }));

    interface FieldOption {
      [key: string]: string;
    }
    const fieldOptions: FieldOption[] = measures.map((measure) => ({
      [measure.label]: measure.name,
    }));
    const kpiFieldDefault = measures[0].name;
    const comparisonFieldDefault = measures.length > 1 ? measures[1].name : "";
    const gaugeFieldDefault = measures.length > 2 ? measures[2].name : "";




    const { dimension_like: dimensionLike } = queryResponse.fields;

      const dimensions1 = dimensionLike.map((dimension) => ({
         label: dimension.label_short ?? dimension.label,
         name: dimension.name


       }));



       const { measure_like: measureLike } = queryResponse.fields;


       const measures1 = measureLike.map((measure) => ({
         label: measure.label_short ?? measure.label,
         name: measure.name,
       }));


       const fieldOptionsNew = [...dimensions1, ...measures1].map((dim) => ({
        [dim.label]: queryResponse.data.map(row => row[dim.name].value).join(",")
      }));




    // get config options
    const options = {
      // fields
      kpiField: {
        label: "13 Week Average Value",
        type: "string",
        display: "select",
        default: kpiFieldDefault,
        values: fieldOptions,
        section: SECTIONS.fields,
        order: 1,
      },
      comparisonField: {
        label: "Comparison Period Value",
        type: "string",
        display: "select",
        default: comparisonFieldDefault,
        values: fieldOptions,
        section: SECTIONS.fields,
        order: 2,
      },
      gaugeField: {
        label: "Target Value",
        type: "string",
        display: "select",
        default: "Target Value",
        values: fieldOptions,
        section: SECTIONS.fields,
        order: 3,
      },

        targetNumber: {
        label: "Target Value",
        type: "string",
        display: "select",
        default: "Target Value",
        values: fieldOptionsNew,
        section: SECTIONS.fields,
        order: 4,
      },
      // layout
      isPeriodComparisonVisible: {
        label: "Show Period Comparison",
        default: true,
        type: "boolean",
        section: SECTIONS.layout,
        order: 1,
      },
      // isGaugeVisible: {
      //   label: "Show Gauge",
      //   default: true,
      //   type: "boolean",
      //   section: SECTIONS.layout,
      //   order: 2,
      // },
      kpiLabel: {
        label: "Title of Tile",
        type: "string",
        display: "select",
        placeholder: "Please Select",
        default: "Please Select",
        values: fieldOptionsNew,
        section: SECTIONS.layout,
        order: 3,
      },
      // kpiValueUnit: {
      //   label: "KPI Value Unit",
      //   default: "sf",
      //   type: "string",
      //   section: SECTIONS.layout,
      //   order: 4,
      // },
      // comparisonLabel: {
      //   label: "Comparison Label",
      //   default: "vs previous period",
      //   type: "string",
      //   section: SECTIONS.layout,
      //   order: 5,
      // },
    };

    this.trigger("registerOptions", options);

    let {
      isPeriodComparisonVisible,
      isGaugeVisible,
      kpiLabel,
      targetNumber,
      kpiValueUnit,
      comparisonLabel,
      kpiField,
      comparisonField,
      gaugeField,
    } = config;


    const Content = config.kpiLabel.split(",").map((d, i) => ({
    kpiLabel: d,
    targetNumber:config.targetNumber.split(",")[i],
  // symbol:config.symbol.split(",")[i],
  // yAxisLeftValues:config.yAxisLeftValues.split(",")[i],
  // yAxisRightDropdown:config.yAxisRightDropdown.split(",")[i],
  // yAxisRightValues:config.yAxisRightValues.split(",")[i],
  // symbol2:config.symbol2.split(",")[i],

  }))


  let kpiLabelValues = Content.map(function(val, i){ return val.kpiLabel })


  let targetNumberValues  = Content.map(function(val, i){ return val.targetNumber })


  let kpiLabelValue1 = kpiLabelValues[0]


  let target = targetNumberValues[0]

  console.log(target)

    // defaults
    isPeriodComparisonVisible = isPeriodComparisonVisible ?? true;
    isGaugeVisible = isGaugeVisible ?? true;
    kpiLabel =  kpiLabelValue1 ?? "Label";
    // kpiValueUnit = kpiValueUnit ?? "sf";
    comparisonLabel = comparisonLabel ?? "vs previous period";
    kpiField = kpiField ?? kpiFieldDefault;
    comparisonField = comparisonField ?? comparisonFieldDefault;
    gaugeField = gaugeField ?? gaugeFieldDefault;

    var kpiValue =
      (data[0][kpiField].rendered as string) ??

      data[0][kpiField].value.toString();


      var kpiValue  = Math.round(kpiValue)

    let comparisonValue = "";
    let comparisonValueRaw;
    if (measures.length > 1) {
      const kpiValueRaw = data[0][kpiField].value;
      const comparisonPeriodValueRaw = data[0][comparisonField].value;
      comparisonValueRaw =
        ((kpiValueRaw - comparisonPeriodValueRaw) / comparisonPeriodValueRaw) *
        100;
      comparisonValue = `${Math.round(comparisonValueRaw)}%`;
    }

    let gaugeValue: number | undefined;
    if (measures.length > 2) {
      gaugeValue = data[0][gaugeField].value;
    }

    const dataValues: DataValues = {
      kpiValue,
      comparisonValue,
      comparisonValueRaw,
      gaugeValue,
    };




    // create react root
    element.innerHTML = '<div id="app"></div>';
    const root = createRoot(document.getElementById("app"));
    root.render(
      <KpiVis
        isPeriodComparisonVisible={isPeriodComparisonVisible}
        isGaugeVisible={isGaugeVisible}
        kpiLabel={kpiLabel}
        target={target}
        // kpiValueUnit={kpiValueUnit}
        comparisonLabel={comparisonLabel}
        dataValues={dataValues}
      />
    );

    done();
  },
});
