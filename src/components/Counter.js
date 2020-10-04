import React from "react";

function Counter(props) {
  return (
    <div className="header-counter">
      <span id="total-count"> Total Count : {props.totalCount} </span>
      <span id="total-active">
        Total Active : {props.totalCount - (props.totalDeath + props.discharged)}
      </span>
      <span id="total-death"> Total Death : {props.totalDeath} </span>
      <span id="total-discharge">Discharged : {props.discharged} </span>
    </div>
  );
}

export default Counter;
