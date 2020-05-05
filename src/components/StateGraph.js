import React from "react"
import Chart from "../../node_modules/chart.js/dist/Chart.bundle.min.js"

class StateGraph extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			history: this.props.history
		}
		
	}


	componentDidMount(){
		
		let hist = this.state.history.map( stateHistory => stateHistory.summary.total);
		let days = this.state.history.map( day => day.day);
		

		var stars = [135850, 52122, 148825, 16939, 9763];
		var frameworks = ['React', 'Angular', 'Vue', 'Hyperapp', 'Omi'];

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