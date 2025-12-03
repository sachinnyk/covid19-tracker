import React from "react";

function Counter(props) {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="header-counter">
      <span id="total-count">
        <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>Total Cases</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatNumber(props.totalCount)}</div>
      </span>
      <span id="total-active">
        <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>Active Cases</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatNumber(props.totalCount - (props.totalDeath + props.discharged))}</div>
      </span>
      <span id="total-death">
        <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>Deaths</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatNumber(props.totalDeath)}</div>
      </span>
      <span id="total-discharge">
        <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>Discharged</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatNumber(props.discharged)}</div>
      </span>
    </div>
  );
}

export default Counter;
