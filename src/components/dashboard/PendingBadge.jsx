import React from "react";
import { Statistic } from "antd";
import "./PendingBadge.css";

const PendingBadge = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <div className="pendingBadge">
      <Statistic 
        value={count} 
        suffix="pending"
        styles={{ fontSize: "14px", color: "#faad14" }}
      />
    </div>
  );
};

export default PendingBadge;