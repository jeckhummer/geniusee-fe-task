import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components/App';
import { buildServices, ServiceProvider } from './services';

import 'semantic-ui-css/semantic.min.css';
import './index.scss';

const services = buildServices();

ReactDOM.render(
    <ServiceProvider services={services}>
        <App />
    </ServiceProvider>,
    document.getElementById("app"),
);
