import React from 'react';
import { OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
// props -> TooltipText, buttonText, buttonstyle

function TooltipButton({ tooltipText, buttonStyle, buttonText }) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltipText}</Tooltip>}>
      {({ ref, ...triggerHandler }) => (
        <Button
          {...triggerHandler}
          className={buttonStyle}
        >
          <span ref={ref}>{buttonText}</span>
        </Button>
      )}
    </OverlayTrigger>
  );
}

export default TooltipButton;
