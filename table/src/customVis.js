
import * as React from "react";
import * as ReactDOM from "react-dom";
import { CustomTable } from "./CustomTable";
import PaginationComponent from "./PaginationComponent";

looker.plugins.visualizations.add({
  create: function (element, config) {

  },

updateAsync: function (data, element, config, queryResponse, details, done) {

const { dimension_like: dimensionLike } = queryResponse.fields;

const dimensions = dimensionLike.map((dimension) => ({
   label: dimension.label_short ?? dimension.label,
   name: dimension.name


 }));



 const { measure_like: measureLike } = queryResponse.fields;


 const measures = measureLike.map((measure) => ({
   label: measure.label_short ?? measure.label,
   name: measure.name,
 }));



 const fieldOptions = [...dimensions, ...measures].map((dim) => ({
     [dim.label]: queryResponse.data.map(row => row[dim.name].value).join(",")
   }));

console.log(data, "data api response")

    const options = {

      textTitle: {
        type: "string",
        label: "Choose Title from Dropdown",
        display: "select",
        placeholder: "Please Select",
        values: fieldOptions,
        order: 1,
        default:"Please Select",
        section: "Style",
      },

      color_title: {
        type: 'array',
        label: 'Title Background Color',
        display: 'colors',
        default: ['#00363d', '#17494d', '#498283', '#bdd9d7', '#aecfc2', '#d1e8df', '#edf8f4', '#f5fcfc'],
        order: 2,
        section: "Style",
      },

      titleColor: {
      type: "string",
      label: "Title Color",
      default: "#ffffff",
      display: "text",
      placeholder: "#ffffff",

      order: 3,
      section: "Style",
    },

      writeTitle: {
        type: "string",
        label: "Write Title Text Instead",
        default: "",
        order: 4,
        section: "Style",
      },

      tableBordered: {
       type: "boolean",
       label: "Hide Header",
       default: false,
       order: 5,
       section: "Style",
     },

           toolOn: {
             type: "boolean",
             label: "Turn on Tooltip for Title",
             default: false,
             order: 6,
               section: "Style",
           },

           writeTooltip: {
             type: "string",
             label: "Write Tooltip Text",
             default: "",
             order: 7,
            section: "Style",
           },

     fixedHeight: {
      type: "boolean",
      label: "Table Fixed Height",
      default: true,
      order: 8,
      section: "Style",
    },

    hidePag: {
     type: "boolean",
     label: "Hide Pagination",
     default: true,
     order: 9,
    section: "Style",
    },
    unsetTable: {
     type: "boolean",
     label: "Make Table Column Width Unset",
     default: false,
     order: 10,
     section: "Style",
    },
    //
    // removeBars: {
    //  type: "boolean",
    //  label: "Center Small Table",
    //  default: false,
    //  order: 5,
    // },

    index: {
     type: "boolean",
     label: "Show Row Index",
     default: true,
     order: 11,
      section: "Style",
    },

    border: {
     type: "boolean",
     label: "Remove Border",
     default: false,
     order: 12,
      section: "Style",
    },




      bodyStyle: {
          type: "string",
          label: "Choose Font",
          display: "select",
          values: [{ "Roboto": "'Roboto'" } , { "Open Sans": "'Open Sans'" }, {"Montserrat" : "'Montserrat'"}],
          section: "Style",
          default: "'Roboto', sans-serif;",
          order: 29,
        },
        hideTitle: {
          type: "boolean",
          label: "Hide Title",
          default: false,
          order: 30,
          section: "Style",
        },

        tableFontSize: {
           type: "string",
           label: "Table Font Size",
           default: "12px",
           display: "text",
           placeholder: "12px",
           section: "Style",
           order: 31,
         },



    // yesText: {
    //  type: "boolean",
    //  label: "Change Default Header to Dropdown",
    //  default: false,
    //  order: 11,
    //   section: "Style",
    // },
    //
    //
    //         headerText: {
    //         type: "string",
    //         label: "Choose Header Text from Dropdown",
    //
    //         display: "select",
    //
    //         values: fieldOptions,
    //         order: 12,
    //         default:'',
    //         section: "Style",
    //       },



  };




 this.trigger("registerOptions", options);

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
