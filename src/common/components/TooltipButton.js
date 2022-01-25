import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// props -> TooltipText, buttonText, buttonstyle

function TooltipButton({ tooltipText, buttonStyle, buttonText }) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltipText}</Tooltip>}>
      {({ ref, ...triggerHandler }) => (
        <button
          {...triggerHandler}
          className={buttonStyle}
        >
          <span ref={ref}>{buttonText}</span>
        </button>
      )}
    </OverlayTrigger>
  );
}

export default TooltipButton;
