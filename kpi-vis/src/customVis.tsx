import "./style.css";
import { Looker } from "./types";
import { createRoot } from "react-dom/client";
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { UpArrowSVG, DownArrowSVG, SECTIONS } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

// Global values provided via the API
declare var looker: Looker;

const gaugeChartOptions: ChartOptions<"doughnut"> = {
  cutout: "75%",
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
  kpiValueUnit: string;
  comparisonLabel: string;
}

function KpiVis({
  dataValues,
  isPeriodComparisonVisible,
  isGaugeVisible,
  kpiLabel,
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
  const gaugeData: ChartData<"doughnut", number[], unknown> = {
    datasets: [
      {
        data: [gaugeValueRounded, 100 - gaugeValueRounded],
        backgroundColor: [gaugeColor, "#EBEBFF"],
      },
    ],
  };

  return (
    <div id="vis-wrapper">
      <div id="left-side">
        <div id="kpi-label">{kpiLabel}</div>
        <div id="kpi-value">
          {kpiValue}&nbsp;
          {kpiValueUnit}
        </div>
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
              >
                {comparisonValue}
              </span>
            </div>
            <span id="change-label">{comparisonLabel}</span>
          </div>
        )}
      </div>
      <div id="right-side">
        {isGaugeVisible && (
          <div id="gauge-chart-wrapper">
            <Doughnut data={gaugeData} options={gaugeChartOptions} />
            <span id="gauge-value">{gaugeValueRounded}%</span>
          </div>
        )}
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

    // get config options
    const options = {
      // fields
      kpiField: {
        label: "KPI Value",
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
        label: "Gauge Value",
        type: "string",
        display: "select",
        default: gaugeFieldDefault,
        values: fieldOptions,
        section: SECTIONS.fields,
        order: 3,
      },
      // layout
      isPeriodComparisonVisible: {
        label: "Show Period Comparison",
        default: true,
        type: "boolean",
        section: SECTIONS.layout,
        order: 1,
      },
      isGaugeVisible: {
        label: "Show Gauge",
        default: true,
        type: "boolean",
        section: SECTIONS.layout,
        order: 2,
      },
      kpiLabel: {
        label: "KPI Label",
        default: "Label",
        type: "string",
        section: SECTIONS.layout,
        order: 3,
      },
      kpiValueUnit: {
        label: "KPI Value Unit",
        default: "sf",
        type: "string",
        section: SECTIONS.layout,
        order: 4,
      },
      comparisonLabel: {
        label: "Comparison Label",
        default: "vs previous period",
        type: "string",
        section: SECTIONS.layout,
        order: 5,
      },
    };

    this.trigger("registerOptions", options);

    let {
      isPeriodComparisonVisible,
      isGaugeVisible,
      kpiLabel,
      kpiValueUnit,
      comparisonLabel,
      kpiField,
      comparisonField,
      gaugeField,
    } = config;

    // defaults
    isPeriodComparisonVisible = isPeriodComparisonVisible ?? true;
    isGaugeVisible = isGaugeVisible ?? true;
    kpiLabel = kpiLabel ?? "Label";
    kpiValueUnit = kpiValueUnit ?? "sf";
    comparisonLabel = comparisonLabel ?? "vs previous period";
    kpiField = kpiField ?? kpiFieldDefault;
    comparisonField = comparisonField ?? comparisonFieldDefault;
    gaugeField = gaugeField ?? gaugeFieldDefault;

    const kpiValue =
      (data[0][kpiField].rendered as string) ??
      data[0][kpiField].value.toString();

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
        kpiValueUnit={kpiValueUnit}
        comparisonLabel={comparisonLabel}
        dataValues={dataValues}
      />
    );

    done();
  },
});
