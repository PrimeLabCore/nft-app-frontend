const Analytics = {
  pushEvent(eventName, eventProps = {}) {
    window.dataLayer.push({
      event: eventName,
      eventProps
    });
  }
}

export default Analytics;
