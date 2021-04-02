import React from "react";

function Counter(props) {
  return (
    <div className="header-counter">
      <span id="total-count">Confirmed : {props.totalCount} </span>
      <span id="total-active">
        Active :
        {props.formatValues(
          props.parseValues(props.totalCount) -
            (props.parseValues(props.totalDeath) + props.parseValues(props.discharged))
        )}
      </span>
      <span id="total-death">Deceased : {props.totalDeath} </span>
      <span id="total-discharge">Recovered : {props.discharged} </span>
    </div>
  );
}

export default Counter;
