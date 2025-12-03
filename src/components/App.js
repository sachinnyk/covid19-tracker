import React, { useState, useEffect } from "react";
import "./App.css";
import Counter from "./Counter";
import "bootstrap/dist/css/bootstrap.css";
import StateList from "./StateList";
import StateGraph from "./StateGraph";
import Footer from "./Footer";

function App() {
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeath, setTotalDeath] = useState(0);
  const [discharged, setDischarged] = useState(0);
  const [regional, setRegional] = useState([]);
  const [isConfirmedSorted, setIsConfirmedSorted] = useState(true);
  const [isStateSorted, setIsStateSorted] = useState(false);
  const [isDischargedSorted, setIsDischargedSorted] = useState(true);
  const [isDeathSorted, setIsDeathSorted] = useState(true);
  const [, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [graphData, setGraphData] = useState(undefined);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (isDark) {
      document.body.classList.add('dark-mode');
    }

    // Fetch latest stats
    fetch("https://api.rootnet.in/covid19-in/stats/latest")
      .then((response) => response.json())
      .then((res) => {
        const { regional, summary } = res.data;
        setTotalCases(summary.total);
        setTotalDeath(summary.deaths);
        setDischarged(summary.discharged);
        setRegional(regional);
      })
      .catch((error) => {
        console.error("Error fetching latest stats:", error);
      });

    // Fetch History
    fetch("https://api.rootnet.in/covid19-in/stats/history")
      .then((response) => response.json())
      .then((res) => {
        setHistory(res.data);
        let hist = res.data.map((stateHistory) => stateHistory.summary.total);
        let days = res.data.map((day) => day.day);

        const DrawGraph = {
          labels: days.slice(-30),
          datasets: [
            {
              label: "# Of Total Cases for last 30 days",
              data: hist.slice(-30),
              borderColor: "rgba(201, 13, 13, 0.97)",
              borderWidth: 1,
              backgroundColor: "rgba(224, 100, 100, 1)",
            },
          ],
        };

        setGraphData(DrawGraph);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
      });

  }, []);

  const sortList = (event) => {
    const tableId = event.target.id;
    const sortArray = [...regional]; // Create a copy to avoid mutating state directly

    switch (tableId) {
      case "state":
        if (isStateSorted) {
          sortArray.sort((a, b) => a.loc.localeCompare(b.loc));
        } else {
          sortArray.sort((a, b) => b.loc.localeCompare(a.loc));
        }
        setIsStateSorted(!isStateSorted);
        setRegional(sortArray);
        toggleSortIcon(event);
        break;

      case "confirmed":
        if (isConfirmedSorted) {
          sortArray.sort((a, b) => b.totalConfirmed - a.totalConfirmed);
        } else {
          sortArray.sort((a, b) => a.totalConfirmed - b.totalConfirmed);
        }
        setIsConfirmedSorted(!isConfirmedSorted);
        setRegional(sortArray);
        toggleSortIcon(event);
        break;

      case "discharged":
        if (isDischargedSorted) {
          sortArray.sort((a, b) => b.discharged - a.discharged);
        } else {
          sortArray.sort((a, b) => a.discharged - b.discharged);
        }
        setIsDischargedSorted(!isDischargedSorted);
        setRegional(sortArray);
        toggleSortIcon(event);
        break;

      case "death":
        if (isDeathSorted) {
          sortArray.sort((a, b) => b.deaths - a.deaths);
        } else {
          sortArray.sort((a, b) => a.deaths - b.deaths);
        }
        setIsDeathSorted(!isDeathSorted);
        setRegional(sortArray);
        toggleSortIcon(event);
        break;

      default:
        console.log("Error Case");
        break;
    }
  };

  const DarkMode = (event) => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    
    // Update document attributes
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle body class for backward compatibility
    document.body.classList.toggle("dark-mode");
  };

  const toggleSortIcon = (event) => {
    const icon = event.target.childNodes[1];
    if (icon.classList.contains("fa-arrow-down")) {
      icon.classList.remove("fa-arrow-down");
      icon.classList.add("fa-arrow-up");
    } else if (icon.classList.contains("fa-arrow-up")) {
      icon.classList.remove("fa-arrow-up");
      icon.classList.add("fa-arrow-down");
    } else {
      icon.classList.add("fa-arrow-up");
    }

    const tableHead = document.getElementById("tblHead");
    if (tableHead) {
      for (let i of tableHead.childNodes) {
        if (i.id !== event.target.id && i.childNodes[1]) {
          i.childNodes[1].classList.remove("fa-arrow-up");
          i.childNodes[1].classList.remove("fa-arrow-down");
        }
      }
    }
  };

  const stateComponents = regional.map((state, index) => (
    <StateList
      key={index}
      loc={state.loc}
      deaths={state.deaths}
      totalConfirmed={state.totalConfirmed}
      discharged={state.discharged}
    />
  ));

  return (
    <div className="App">
      <nav className="navbar navbar-light">
        <span className="navbar-brand mb-0 h1">Covid 19 India Tracker</span>
        <span>
          <button id="dk-mode" onClick={DarkMode} aria-label="Toggle dark mode">
            <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>
        </span>
      </nav>
      {totalDeath > 0 ? (
        <Counter
          totalCount={totalCases}
          totalDeath={totalDeath}
          discharged={discharged}
        />
      ) : (
        ""
      )}
      <div className="container">
        <div className="row" id="tblHead">
          <div className="col tableHeader mx-1" onClick={sortList} id="state">
            State <i className="fas fa-arrow-down"></i>
          </div>
          <div className="col tableHeader mx-1" onClick={sortList} id="confirmed">
            Confirmed <i className="fas"></i>
          </div>
          <div className="col tableHeader mx-1" id="active">
            Active <i className="fas"></i>
          </div>
          <div className="col tableHeader mx-1" onClick={sortList} id="discharged">
            Discharged <i className="fas"></i>
          </div>
          <div className="col tableHeader mx-1" onClick={sortList} id="death">
            Deaths <i className="fas"></i>
          </div>
        </div>
        {stateComponents}
      </div>
      <div id="stateGraph">
        {graphData !== undefined ? <StateGraph data={graphData} /> : ""}
      </div>
      <Footer />
    </div>
  );
}

export default App;
