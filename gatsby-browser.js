// count.js counts the first load itself; count client-side navigations here.
exports.onRouteUpdate = ({ location, prevLocation }) => {
  if (!prevLocation || !window.goatcounter || !window.goatcounter.count) {
    return;
  }

  window.goatcounter.count({ path: location.pathname + location.search + location.hash });
};
