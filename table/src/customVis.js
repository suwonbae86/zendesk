// To allow invalid https certificates from localhost in Chrome: chrome://flags/#allow-insecure-localhost

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CustomTable } from "./CustomTable";
import PaginationComponent from "./PaginationComponent";

looker.plugins.visualizations.add({
  options: {



  tableBordered: {
   type: "boolean",
   label: "Hide Header",
   default: false,
   order: 1,
 },
 fixedHeight: {
  type: "boolean",
  label: "Table Fixed Height",
  default: false,
  order: 2,
},

hidePag: {
 type: "boolean",
 label: "Hide Pagination",
 default: false,
 order: 3,
},
unsetTable: {
 type: "boolean",
 label: "Table Column Width Unset or Fixed",
 default: false,
 order: 4,
},

removeBars: {
 type: "boolean",
 label: "Center Small Table",
 default: false,
 order: 5,
},







  },




  create: function (element, config) {
    // console.log("create-config", config);
  },


  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {

    // const options = {
    //       // fields
    //       kpiField: {
    //         label: "KPI Value",
    //         type: "string",
    //         display: "select",
    //         default: kpiFieldDefault,
    //         values: fieldOptions,
    //         section: SECTIONS.fields,
    //         order: 1,
    //       },
    //       comparisonField: {
    //         label: "Comparison Period Value",
    //         type: "string",
    //         display: "select",
    //         default: comparisonFieldDefault,
    //         values: fieldOptions,
    //         section: SECTIONS.fields,
    //         order: 2,
    //       },
    //       gaugeField: {
    //         label: "Gauge Value",
    //         type: "string",
    //         display: "select",
    //         default: gaugeFieldDefault,
    //         values: fieldOptions,
    //         section: SECTIONS.fields,
    //         order: 3,
    //       },
    //       // layout
    //       isPeriodComparisonVisible: {
    //         label: "Show Period Comparison",
    //         default: true,
    //         type: "boolean",
    //         section: SECTIONS.layout,
    //         order: 1,
    //       },
    //       isGaugeVisible: {
    //         label: "Show Gauge",
    //         default: true,
    //         type: "boolean",
    //         section: SECTIONS.layout,
    //         order: 2,
    //       },
    //       kpiLabel: {
    //         label: "KPI Label",
    //         default: "Label",
    //         type: "string",
    //         section: SECTIONS.layout,
    //         order: 3,
    //       },
    //       kpiValueUnit: {
    //         label: "KPI Value Unit",
    //         default: "sf",
    //         type: "string",
    //         section: SECTIONS.layout,
    //         order: 4,
    //       },
    //       comparisonLabel: {
    //         label: "Comparison Label",
    //         default: "vs previous period",
    //         type: "string",
    //         section: SECTIONS.layout,
    //         order: 5,
    //       },
    //     };
 // this.trigger("registerOptions", options);

    ReactDOM.render(

      <CustomTable
        data={data}
        config={config}
        queryResponse={queryResponse}
        details={details}
        done={done}
      />

      ,

      element
    );

  done()
  },
});
