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
            var label = "Confirmed cases on ";
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
            var date = new Date(tooltipItem.xLabel);
            label += `${date.getDate()}-${month[date.getMonth()]}-${date.getFullYear()} :`;
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
    <div id="stateChart" className="ct-chart ct-perfect-fourth">
      <Bar data={props.data} options={options} width={700} height={500} />
    </div>
  );
}

export default StateGraph;
