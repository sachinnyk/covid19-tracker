import React from "react";
import "bootstrap/dist/css/bootstrap.css";

function StateList(props) {
  return (
    <div className="rowlist">
      <div className="stateName cell" onClick={props.renderStateGraph}>
        <span>{props.loc}</span>
      </div>
      <div className="cell">
        <span>{props.formatValues(props.totalConfirmed)}</span>
      </div>
      <div className="cell">
        <span>{props.formatValues(props.totalConfirmed - (props.discharged + props.deaths))}</span>
      </div>
      <div className="cell">
        <span>{props.formatValues(props.discharged)}</span>
      </div>
      <div className="cell">
        <span>{props.formatValues(props.deaths)}</span>
      </div>
    </div>
  );
}

export default StateList;
