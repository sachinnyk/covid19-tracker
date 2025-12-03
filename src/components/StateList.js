import React from "react";
import "bootstrap/dist/css/bootstrap.css";

function StateList(props) {
  return (
    <div className="row">
      <div className="col mx-1 stateName" data-statecode="AB">
        {props.loc}
      </div>
      <div className="col mx-1">{props.totalConfirmed}</div>
      <div className="col mx-1">{props.totalConfirmed - (props.discharged + props.deaths)}</div>
      <div className="col mx-1">{props.discharged}</div>
      <div className="col mx-1">{props.deaths}</div>
    </div>
  );
}

export default StateList;
