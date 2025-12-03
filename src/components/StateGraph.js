import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StateGraph(props) {
  const [options, setOptions] = useState();
  const [theme, setTheme] = useState(() => 
    document.documentElement.getAttribute('data-theme') || 'light'
  );

  useEffect(() => {
    function chartOptions() {
      const isDark = theme === 'dark';
      const textColor = isDark ? '#ffffff' : '#212529';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      
      const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: textColor,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            cornerRadius: 8,
            displayColors: false,
            backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
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
                var date = new Date(context.label);
                label += `${date.getDate()}-${month[date.getMonth()]}-${date.getFullYear()} : `;
                label += new Intl.NumberFormat('en-IN').format(Math.round(context.parsed.y));
                return label;
              },
              title: function () {
                return "";
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
              font: {
                size: 11,
              },
            },
            grid: {
              color: gridColor,
            },
          },
          y: {
            ticks: {
              color: textColor,
              font: {
                size: 11,
              },
              callback: function(value) {
                return new Intl.NumberFormat('en-IN', {
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value);
              },
            },
            grid: {
              color: gridColor,
            },
          },
        },
      };
      setOptions(options);
    }

    chartOptions();
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, [theme]);

  // Get theme for chart colors
  const isDark = theme === 'dark';
  const chartColors = isDark 
    ? {
        borderColor: "rgba(255, 107, 107, 0.97)",
        backgroundColor: "rgba(255, 107, 107, 0.5)",
      }
    : {
        borderColor: "rgba(201, 13, 13, 0.97)",
        backgroundColor: "rgba(224, 100, 100, 1)",
      };

  const chartData = props.data ? {
    ...props.data,
    datasets: props.data.datasets.map(dataset => ({
      ...dataset,
      ...chartColors,
    })),
  } : null;

  return (
    <div 
      id="stateChart" 
      className="chart-container"
      style={{ 
        width: "100%", 
        maxWidth: "900px",
        height: "500px"
      }}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}

export default StateGraph;
