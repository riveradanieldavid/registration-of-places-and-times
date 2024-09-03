import React from "react";
import { ExpandedComponentProps } from "../interfaces/types";

const ExpandedComponent: React.FC<ExpandedComponentProps> = ({
  expandedRowId,
  item,
  today
}) => {
  return (
    <React.Fragment>
      {/* ITEMS EXPANDIBLES EN MODO TELEFONO*/}
      {expandedRowId === item.id && (
        <div
          className={`expanded-info selected-row ${
            item.date.trim() === today ? "highlight" : ""
          }`}
        >
          {/* CONDUCTOR */}
          <div
            className={`expanded-info-header grid-header ${
              item.date.trim() === today ? "highlight" : ""
            }`}
          >
            Conductor
          </div>
          <div
            className={`grid-item expand-content selected-row grid-header ${
              item.date.trim() === today ? "highlight" : ""
            }`}
          >
            {item.servant}
          </div>
          {/* TERRITORIO */}
          <div
            className={`expanded-info-header grid-header ${
              item.date.trim() === today ? "highlight" : ""
            }`}
          >
            Territorio
          </div>
          <div
            className={`grid-item expand-content selected-row grid-header ${
              item.date.trim() === today ? "highlight" : ""
            }`}
          >
            {item.territory}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ExpandedComponent;
