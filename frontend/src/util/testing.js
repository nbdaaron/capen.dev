import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

/**
 * Wraps components in a React Router.
 * Necessary for components that use Links or Switches.
 * You can pass the current route to designate what page
 * the Router should currently be set to.
 */
export const wrapRouter = (Component, currentRoute, props) => {
  const history = createMemoryHistory();
  history.push(currentRoute);
  return (
    <Router history={history}>
      <Component {...props} />
    </Router>
  );
};

/**
 * Accepts a router (usually from wrapRouter) and
 * returns the current route.
 * Useful for testing Link elements and other elements
 * that manipulate the current page.
 */
export const getCurrentRoute = router => router.props.history.location.pathname;
