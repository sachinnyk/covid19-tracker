import React from 'react';
import './App.css';
import Counter from './Counter';
import 'bootstrap/dist/css/bootstrap.css';
import StateList from './StateList'
import StateGraph from './StateGraph'
class App extends React.Component {

  constructor(){
    super();
    this.state = {
      totalCases:0,
      totalDeath:0,
      confirmedCasesIndian:0,
      discharged:0,
      confirmedCasesForeign:0,
      regional:[],
      isConfirmedSorted:true,
      isStateSorted:false,
      isDischargedSorted : true,
      isDeathSorted : true,
      history:[]
    }

    this.sortList = this.sortList.bind(this);
    this.toggleSortIcon = this.toggleSortIcon.bind(this);
  }

  componentDidMount(){

      fetch('https://api.rootnet.in/covid19-in/stats/latest')
      .then( response => response.json() )
      .then( res => {
        const { regional , summary } = res.data;
        this.setState({totalCases : summary.total,
                totalDeath : summary.deaths,
                confirmedCasesIndian : summary.confirmedCasesIndian,
                discharged : summary.discharged,
                confirmedCasesForeign : summary.confirmedCasesForeign,
                regional : regional });

      });
      //Fetch History
      fetch('https://api.rootnet.in/covid19-in/stats/history')
      .then( response => response.json())
      .then(res => {
        
        this.setState({history : res.data})

      })

    };
  
  sortList(event){
    const tableId = event.target.id;
    
    const sortArray = this.state.regional;
    switch(tableId){
       case "state": 
  
    this.state.isStateSorted ? sortArray.sort((a,b)=> a.loc.localeCompare(b.loc)) : sortArray.sort((a,b)=> b.loc.localeCompare(a.loc));
    this.setState({isStateSorted: !this.state.isStateSorted , regional :sortArray });
    this.toggleSortIcon(event);
    
     break;
     case "confirmed":
      this.state.isConfirmedSorted ? sortArray.sort((a,b) => b.totalConfirmed - a.totalConfirmed) : sortArray.sort((a,b) => a.totalConfirmed - b.totalConfirmed) ;
      this.setState({regional : sortArray,isConfirmedSorted : !this.state.isConfirmedSorted });
      this.toggleSortIcon(event);
      
      break;
     case "discharged":
       this.state.isDischargedSorted ? sortArray.sort((a,b) => b.discharged - a.discharged) : sortArray.sort((a,b) => a.discharged - b.discharged)
       this.setState({ regional : sortArray , isDischargedSorted : !this.state.isDischargedSorted});
       this.toggleSortIcon(event);
       break;

     case "death":
       this.state.isDeathSorted ? sortArray.sort((a,b) => b.deaths - a.deaths) : sortArray.sort((a,b) => a.deaths - b.deaths);
       this.setState({ regional : sortArray , isDeathSorted : !this.state.isDeathSorted});
       this.toggleSortIcon(event);

     break;

     default : 
       console.log("Error Case");
     break;
    }

  }


  toggleSortIcon(event){
    if(event.target.childNodes[1].classList.contains('fa-arrow-down')){
       event.target.childNodes[1].classList.remove('fa-arrow-down');
       event.target.childNodes[1].classList.add('fa-arrow-up');
      }
      else if(event.target.childNodes[1].classList.contains('fa-arrow-up')){
      event.target.childNodes[1].classList.remove('fa-arrow-up');
       event.target.childNodes[1].classList.add('fa-arrow-down');
      }
      else {
        event.target.childNodes[1].classList.add('fa-arrow-up');

      }

      let child = document.getElementById('tblHead');
      
      for (let i of child.childNodes){
       
        if(i.id !== event.target.id){
          i.childNodes[1].classList.remove('fa-arrow-up');
          i.childNodes[1].classList.remove('fa-arrow-down');
        }
      }
  }


  render(){
 
    const stateComponents = this.state.regional.map( state => <StateList loc={state.loc} deaths={state.deaths} totalConfirmed={state.totalConfirmed} discharged={state.discharged} /> )   
    console.log(this.state.history.length);
    return (
    <div className="App">
     <nav className="navbar navbar-light bg-light">
     <span className="navbar-brand mb-0 h1">Covid 19 India Tracker</span>
     </nav>
     { this.state.totalDeath > 0 ?  <Counter totalCount={this.state.totalCases} totalDeath={this.state.totalDeath} discharged={this.state.discharged}/> : ""}
     <div className="container">
    <div className="row" id="tblHead">
    <div className="col tableHeader mx-1" onClick={this.sortList} id="state">
      State <i className="fas fa-arrow-down"></i>
      </div>
    <div className="col tableHeader mx-1" onClick={this.sortList} id="confirmed">
      Confirmed <i className="fas"></i>
    </div>
    <div className="col tableHeader mx-1" id="active">
      Active <i className="fas"></i>
    </div>
     <div className="col tableHeader mx-1" onClick={this.sortList} id="discharged">
      Discharged <i className="fas"></i>
    </div>
    <div className="col tableHeader mx-1" onClick={this.sortList} id="death">
      Deaths <i className="fas"></i>
    </div>
  </div>
   { stateComponents }
</div>
    <div id="stateGraph">
        {this.state.history.length > 0 ? <StateGraph history={this.state.history}/> : ""}
    </div>
    </div>

  );
  }
   
}

export default App;
