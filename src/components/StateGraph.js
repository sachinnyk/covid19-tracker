import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

function StateGraph(props) {
  const [options, setOptions] = useState();

  function chartOptions() {
    const options = {
      maintainAspectRatio: false,
      tooltips: {
        cornerRadius: 2,
        displayColors: false,
        callbacks: {
          label: function (tooltipItem, data) {
            var label = "";
            let month = [
              "JAN",
              "FEB",
              "MAR",
              "APR",
              "MAY",
              "JUN",
              "JUL",
              "AUG",
              "SEP",
              "OCT",
              "NOV",
              "DEC",
            ];
            data.datasets[0].label.indexOf("Recovered") > 0
              ? (label = "Recoved cases on ")
              : (label = "Confirmed cases on ");
            var date = new Date(tooltipItem.xLabel);
            label += `${date.getDate()}-${month[date.getMonth()]}-${date.getFullYear()} : `;
            label += Math.round(tooltipItem.yLabel * 100) / 100;
            return label;
          },
          title: function (tooltipItem, data) {
            return "";
          },
        },
      },
    };

    setOptions(options);
  }

  useEffect(() => {
    chartOptions();
  }, []);
  return (
    <div className="stateChart">
      <Bar
        data={props.data}
        options={options}
        width={props.canvasWidth}
        height={props.canvasHeight}
      />
    </div>
  );
}

export default StateGraph;
