import React from "react";
import "./App.css";
import Counter from "./Counter";
import "bootstrap/dist/css/bootstrap.css";
import StateList from "./StateList";
import StateGraph from "./StateGraph";
import StateCodes from "./StateCodes";
import Footer from "./Footer";
import Loading from "./Loading";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      totalCases: 0,
      totalDeath: 0,
      confirmedCasesIndian: 0,
      discharged: 0,
      confirmedCasesForeign: 0,
      regional: [],
      isConfirmedSorted: true,
      isStateSorted: false,
      isDischargedSorted: true,
      isDeathSorted: true,
      history: [],
      selectedState: "",
      timeseries: [],
      width: 600,
      canvasHeight: 400,
      stateRecoveredTimeSeries: [],
    };

    this.sortList = this.sortList.bind(this);
    this.toggleSortIcon = this.toggleSortIcon.bind(this);
    this.renderStateGraph = this.renderStateGraph.bind(this);
    this.DarkMode = this.DarkMode.bind(this);
    this.formatValues = this.formatValues.bind(this);
    this.parseValues = this.parseValues.bind(this);
  }

  componentDidMount() {
    if (window.screen.width < 680) {
      this.setState({ width: 400 });
    }

    fetch("https://api.rootnet.in/covid19-in/stats/latest")
      .then((response) => response.json())
      .then((res) => {
        const { regional, summary } = res.data;
        this.setState({
          totalCases: this.formatValues(summary.total),
          totalDeath: this.formatValues(summary.deaths),
          confirmedCasesIndian: this.formatValues(summary.confirmedCasesIndian),
          discharged: this.formatValues(summary.discharged),
          confirmedCasesForeign: summary.confirmedCasesForeign,
          regional: regional,
        });
      });
    //Fetch History
    fetch("https://api.rootnet.in/covid19-in/stats/history")
      .then((response) => response.json())
      .then((res) => {
        this.setState({ history: res.data });
        let hist = res.data.map((stateHistory) => stateHistory.summary.total);
        let days = res.data.map((day) => day.day);
        let discharged = res.data.map((stateHistory) => stateHistory.summary.discharged);
        const DrawGraph = {
          labels: days.slice(-15),
          datasets: [
            {
              label: "# Of Total Cases for last 15 days",
              data: hist.slice(-15),
              borderColor: "rgba(201, 13, 13, 0.97)",
              borderWidth: 1,
              backgroundColor: "rgba(225, 7, 58, 1)",
            },
          ],
        };

        const dischargedGraph = {
          labels: days.slice(-15),
          datasets: [
            {
              label: "# Of Recovered Cases for last 15 days",
              data: discharged.slice(-15),
              borderColor: "rgba(114, 250, 107, 0.98)",
              borderWidth: 1,
              backgroundColor: "rgba(13, 157, 6, 0.98)",
            },
          ],
        };
        this.setState({ graphData: DrawGraph, stateRecoveredTimeSeries: dischargedGraph });
      });
    // Fetching State wise History Data
    fetch("https://api.covid19india.org/v4/min/timeseries.min.json")
      .then((result) => result.json())
      .then((res) => {
        this.setState({ timeseries: res });
      });
  }

  formatValues(input) {
    return new Intl.NumberFormat("en-IN").format(input);
  }
  parseValues(input) {
    return parseInt(input.replace(/,/g, ""));
  }

  sortList(event) {
    const tableId = event.target.id;

    const sortArray = this.state.regional;
    switch (tableId) {
      case "state":
        this.state.isStateSorted
          ? sortArray.sort((a, b) => a.loc.localeCompare(b.loc))
          : sortArray.sort((a, b) => b.loc.localeCompare(a.loc));
        this.setState({
          isStateSorted: !this.state.isStateSorted,
          regional: sortArray,
        });
        this.toggleSortIcon(event);

        break;
      case "confirmed":
        this.state.isConfirmedSorted
          ? sortArray.sort((a, b) => b.totalConfirmed - a.totalConfirmed)
          : sortArray.sort((a, b) => a.totalConfirmed - b.totalConfirmed);
        this.setState({
          regional: sortArray,
          isConfirmedSorted: !this.state.isConfirmedSorted,
        });
        this.toggleSortIcon(event);

        break;
      case "discharged":
        this.state.isDischargedSorted
          ? sortArray.sort((a, b) => b.discharged - a.discharged)
          : sortArray.sort((a, b) => a.discharged - b.discharged);
        this.setState({
          regional: sortArray,
          isDischargedSorted: !this.state.isDischargedSorted,
        });
        this.toggleSortIcon(event);
        break;

      case "death":
        this.state.isDeathSorted
          ? sortArray.sort((a, b) => b.deaths - a.deaths)
          : sortArray.sort((a, b) => a.deaths - b.deaths);
        this.setState({
          regional: sortArray,
          isDeathSorted: !this.state.isDeathSorted,
        });
        this.toggleSortIcon(event);

        break;

      default:
        console.log("Error Case");
        break;
    }
  }

  renderStateGraph(event) {
    this.setState({ selectedState: event.target.innerHTML });
    const stateCode = StateCodes[event.target.innerHTML];
    const st = this.state.timeseries[stateCode]?.dates;
    if (st !== undefined) {
      let days = Object.keys(st);
      const labels = days.slice(-15);
      const cnfmed = labels.map((label) => {
        return st[label]?.delta?.confirmed;
      });

      const graphData = {
        labels: labels,
        datasets: [
          {
            label: `# Of Confirmed Cases for ${event.target.innerHTML} last 15 days`,
            data: cnfmed,
            borderColor: "rgba(201, 13, 13, 0.97)",
            borderWidth: 1,
            backgroundColor: "rgba(225, 7, 58, 1)",
          },
        ],
      };
      const recovered = labels.map((label) => {
        return st[label]?.delta?.recovered;
      });

      const recoveredData = {
        labels: labels,
        datasets: [
          {
            label: `# Of Recovered Cases for ${event.target.innerHTML} last 15 days`,
            data: recovered,
            borderColor: "rgba(121, 86, 10, 0.97)",
            borderWidth: 1,
            backgroundColor: "rgba(40, 167, 69, 1)",
          },
        ],
      };
      console.log(recoveredData);
      if (window.screen.width < 680) {
        this.setState({ width: 400 });
      }
      this.setState({ graphData: graphData, stateRecoveredTimeSeries: recoveredData });
    }
  }

  DarkMode(event) {
    let ele = document.body;
    ele.classList.toggle("dark-mode");

    if (event.target.classList.contains("fa-moon")) {
      event.target.classList.remove("fa-moon");
      event.target.classList.add("fa-sun");
    } else {
      event.target.classList.remove("fa-sun");
      event.target.classList.add("fa-moon");
    }
  }

  toggleSortIcon(event) {
    if (event.target.childNodes[1].classList.contains("fa-arrow-down")) {
      event.target.childNodes[1].classList.remove("fa-arrow-down");
      event.target.childNodes[1].classList.add("fa-arrow-up");
    } else if (event.target.childNodes[1].classList.contains("fa-arrow-up")) {
      event.target.childNodes[1].classList.remove("fa-arrow-up");
      event.target.childNodes[1].classList.add("fa-arrow-down");
    } else {
      event.target.childNodes[1].classList.add("fa-arrow-up");
    }

    let child = document.getElementById("tblHead");

    for (let i of child.childNodes) {
      if (i.id !== event.target.id) {
        i.childNodes[1].classList.remove("fa-arrow-up");
        i.childNodes[1].classList.remove("fa-arrow-down");
      }
    }
  }

  render() {
    const stateComponents = this.state.regional.map((state, index) => (
      <StateList
        key={index}
        loc={state.loc}
        deaths={state.deaths}
        totalConfirmed={state.totalConfirmed}
        discharged={state.discharged}
        renderStateGraph={this.renderStateGraph}
        formatValues={this.formatValues}
      />
    ));

    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">Covid 19 India Tracker</span>
          <span>
            <button id="dk-mode" onClick={this.DarkMode}>
              <i className="fas fa-moon"></i>
            </button>
          </span>
        </nav>
        {parseInt(this.state.totalDeath) > 0 ? (
          <>
            <Counter
              totalCount={this.state.totalCases}
              totalDeath={this.state.totalDeath}
              discharged={this.state.discharged}
              formatValues={this.formatValues}
              parseValues={this.parseValues}
            />
            <div className="container">
              <div className="rowlist" id="tblHead">
                <div className="tableHeader cell" onClick={this.sortList} id="state">
                  State <i className="fas fa-arrow-down"></i>
                </div>
                <div className="tableHeader cell" onClick={this.sortList} id="confirmed">
                  <i className="fas" id="cnfmed"></i>
                </div>
                <div className="tableHeader cell" id="active">
                  Active <i className="fas"></i>
                </div>
                <div className="tableHeader cell" onClick={this.sortList} id="discharged">
                  <i className="fas" id="discharge"></i>
                </div>
                <div className="tableHeader" onClick={this.sortList} id="death">
                  Deaths <i className="fas"></i>
                </div>
              </div>
              {stateComponents}
            </div>
          </>
        ) : (
          <Loading />
        )}

        <div id="stateGraph">
          {this.state.graphData !== undefined ? (
            <>
              <StateGraph
                data={this.state.graphData}
                canvasWidth={this.state.width}
                canvasHeight={this.state.canvasHeight}
              />
              <StateGraph
                data={this.state.stateRecoveredTimeSeries}
                canvasWidth={this.state.width}
                canvasHeight={this.state.canvasHeight}
              />
            </>
          ) : (
            ""
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
