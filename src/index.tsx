import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";

import { App } from './components/App';
import { buildServices, ServiceProvider } from './services';
import { store } from './store';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

const services = buildServices();

ReactDOM.render(
    <Provider store={store}>
        <ServiceProvider services={services}>
            <Router>
                <App />
            </Router>
        </ServiceProvider>
    </Provider>,
    document.getElementById("app"),
);
