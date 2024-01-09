import "./style.scss";
import { createRoot } from "react-dom/client";
import React from "react";
import "bootstrap/scss/bootstrap.scss";
import { Fields, Looker, LookerChartUtils } from "./types";
import BarLineVis from "./components/BarLineVis";

// Global values provided via the Looker custom visualization API
declare var looker: Looker;
declare var LookerCharts: LookerChartUtils;

interface ConfigOptions {
  [key: string]: {
    [key: string]: any;
    default: any;
  };
}

looker.plugins.visualizations.add({
  // The create method gets called once on initial load of the visualization.
  // It's just a convenient place to do any setup that only needs to happen once.
  create: function (element, config) {},

  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {

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
    const fieldOptions0: FieldOption[] = measures.map((measure) => ({
      [measure.label]: measure.name,
    }));

console.log(fieldOptions0)

    const { dimension_like: dimensionLike } = queryResponse.fields;

    const dimensions1 = dimensionLike.map((dimension) => ({
       label: dimension.label_short ?? dimension.label,
       name: dimension.name


     }));


     const measures1 = measureLike.map((measure) => ({
       label: measure.label_short ?? measure.label,
       name: measure.name,
     }));




const fieldOptions = [...dimensions1, ...measures1].map((dim) => ({
         [dim.label]: queryResponse.data.map(row => row[dim.name].value).join(",")
       }));


console.log(fieldOptions)

const fieldOptions2 = [...dimensions1, ...measures1].map((dim) => ({
    [dim.label]: dim.label
  }));


  const firstmeasure = measures[0].name;
  const secondmeasure = measures.length > 1 ? measures[1].name : "";
  const thirdmeasure = measures.length > 2 ? measures[2].name : "";




const lookerVis = this;
    const configOptions: ConfigOptions = {

      hideBox: {
        type: "boolean",
        label: "Hide KPI Box and Only Show Chart",
        default: false,
        order: 1,
        section: "Style",
      },
      textTitle: {
        type: "string",
        label: "Choose Title from Dropdown",
        display: "select",
        placeholder: "Please Select",
        values: fieldOptions,
        order: 3,
        default:"Please Select",
        section: "Style",
      },

      color_title: {
        type: 'array',
        label: 'Title Background Color',
        display: 'colors',
        default: ['#00363d', '#17494d', '#498283', '#bdd9d7', '#aecfc2', '#d1e8df', '#edf8f4', '#f5fcfc'],
        order: 4,
        section: "Style",
      },

      writeTitle: {
        type: "string",
        label: "Write Title Text Instead",
        default: "",
        order: 5,
        section: "Style",
      },


      titleColor: {
      type: "string",
      label: "Title Color",
      default: "#ffffff",
      display: "text",
      placeholder: "#ffffff",

      order: 6,
      section: "Style",
    },

      yAxisDropdown: {
        type: "string",
        label: "Choose Percentage Change Value",
        display: "select",
        default:secondmeasure,
        values: fieldOptions,
        order: 6,
        default:"Please Select",
        section: "KPI-Values",
      },

      hideTarget: {
        type: "boolean",
        label: "Hide Target",
        default: false,
        order: 7,
        section: "KPI-Values",
      },

      toolOn: {
        type: "boolean",
        label: "Turn on Tooltip for KPI Tile",
        default: false,
        order: 8,
        section: "KPI-Values",
      },

      writeTooltip: {
        type: "string",
        label: "Write Tooltip Text",
        default: "",
        order: 9,
        section: "KPI-Values",
      },


      hideColors: {
        type: "boolean",
        label: "Hide Variance Colors",
        default: false,
        order: 10,
        section: "KPI-Values",
      },


           symbol: {
            type: "string",
            label: "Select Target Value",
            display: "select",

            default:firstmeasure,
            values: fieldOptions,
            order: 26,

            section: "KPI-Values",
          },


          writeTarget: {
            type: "string",
            label: "Write Target Text Instead",
            default: "",
            order: 27,
            section: "KPI-Values",
          },


      showXGridLines: {
        type: "boolean",
        label: "Show Legend",
        default: false,
        order: 21,
        section: "Chart",
      },
      showYGridLines: {
        type: "boolean",
        label: "Show Y Axis Tick Values",
        default: false,
        order: 22,
        section: "Chart",
      },
      showDatalabels: {
        type: "boolean",
        label: "Show Data Labels",
        default: false,
        order: 23,
        section: "Chart",
      },

      showX: {
        type: "boolean",
        label: "Show X Axis Tick Values",
        default: false,
        order: 24,
        section: "Chart",
      },

      showTwo: {
        type: "boolean",
        label: "Show First and Last X Axis Values",
        default: true,
        order: 25,
        section: "Chart",
      },

      color_range: {
        type: 'array',
        label: 'Color Range',
        display: 'colors',
        default: ['#a2c4c9', '#00363d', '#dd3333', '#80ce5d', '#f78131', '#369dc1', '#c572d3', '#36c1b3', '#b57052', '#ed69af'],
        order: 24,
        section: "Style",
      },
      lastBar: {
        type: "boolean",
        label: "Remove Dark Color from Last Column",
        default: false,
        order: 25,
        section: "Style",
      },
      yAxisLeftValues: {
        type: "string",
        label: "Choose Measure Value for Chart",
        display: "select",
        default: firstmeasure,
        values: fieldOptions,
        order: 0,

        section: "Chart",
      },

      borderLine: {
        type: "boolean",
        label: "Remove Border",
        default: false,
        order: 26,
        section: "Style",
      },

      hideBottom: {
        type: "boolean",
        label: "Hide Bottom Section",
        default: false,
        order: 27,
        section: "Style",
      },

      sign: {
      type: "string",
      label: "Add Symbol",
      display: "select",
      values: [
         {"Dollar": "$"},
         {"Percentage": "%"},
         {"No Symbol": ""}

      ],
      default: "",
      section: "Style",
    }

    };




    lookerVis.trigger("registerOptions", configOptions);

    // assign defaults to config values, which first render as undefined until configOptions is registered
    const validatedConfig = { ...config };
    const configKeys = Object.keys(validatedConfig);
    for (let i = 0; i < configKeys.length; i++) {
      if (validatedConfig[configKeys[i]] === undefined) {
        const configKey = configKeys[i] as keyof typeof configOptions;
        validatedConfig[configKey] = configOptions[configKey].default;
      }
    }


    // get dimensions and measures
    const { dimension_like, measure_like, pivots } = queryResponse.fields;
    const fields: Fields = {
      dimensions: dimension_like.map((d) => d.name),
      dimensionsLabel: dimension_like.map((d) => d.label_short),
      measures: measure_like.map((m) => m.name),
      measuresLabel: measure_like.map((m) => m.label_short),
      pivots: pivots?.map((p) => p.name),
    };



    // console.log(fields)

    // create react root
    element.innerHTML = '<div id="app"></div>';

    const root = createRoot(document.getElementById("app"));
    root.render(
      <BarLineVis
        data={data}
        fields={fields}
        config={validatedConfig}
        lookerCharts={LookerCharts}
        lookerVis={lookerVis}
      />
    );

    done();
  },
});
