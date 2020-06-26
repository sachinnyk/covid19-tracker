import React from "react"
import Chart from "../../node_modules/chart.js/dist/Chart.bundle.min.js"

class StateGraph extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			history: this.props.history,
			location : ""
		}
		
	}

	componentDidUpdate(){
		
		if(this.props.stt !== ""){

			let days = this.state.history.map( day => day.day);
			let statewise=[];
			let regional = this.state.history.map(reg => {
			reg.regional.forEach(ele => { 
			if(ele.loc === this.props.stt) { statewise.push(ele.totalConfirmed)}
			})});

			var ctx = document.getElementById('stateCanvas');
			
			var chart = new Chart(ctx,{
			type:'line',
			data : {
			labels:days,
			datasets : [{
				label : this.props.stt,
				data : statewise,
				fill:false,
				borderColor:'red',
				borderCapStyle : 'square',
				lineTension : 0.1,


			}],
			options :{
				text:'Custom chart title',
				display:true,
				
			}
		}


		})

		}
		

	}

	componentDidMount(){
		
		let hist = this.state.history.map( stateHistory => stateHistory.summary.total);
		let days = this.state.history.map( day => day.day);
         
		let statewise=[];
	    
	    
		/*let regional = this.state.history.map(reg => {
			 reg.regional.forEach(ele => { 
			if(ele.loc === "Delhi") { statewise.push(ele.totalConfirmed)}
		})});*/
	
		/*let statewise = regional.map( state => state.map(st => st.loc ==="Delhi" ? st.totalConfirmed : 0 ));
		console.log(statewise);*/

		var ctx = document.getElementById('stateCanvas');
		var chart = new Chart(ctx,{
			type:'line',
			data : {
			labels:days,
			datasets : [{
				label : 'Daily count',
				data : hist,
				fill:false,
				borderColor:'red',
				borderCapStyle : 'square',
				lineTension : 0.1,


			}],
			options :{
				text:'Custom chart title',
				display:true,
				
			}
		}


		})


	}

	render(){
		
		return(
			<div id="stateChart">
			<canvas id="stateCanvas"> </canvas>
		   </div>
			)


	}
}

export default StateGraph;