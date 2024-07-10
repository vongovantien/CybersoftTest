import React from "react";

const CustomErrorMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div style={{ color: "red", marginTop: "4px" }}>{children}</div>;
};

export default CustomErrorMessage;
