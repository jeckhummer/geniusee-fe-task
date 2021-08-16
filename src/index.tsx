import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { App } from './components/App';
import { buildServices, ServiceProvider } from './services';
import { store } from './store';

import 'semantic-ui-css/semantic.min.css';
import './index.scss';

const services = buildServices();

ReactDOM.render(
    <Provider store={store}>
        <ServiceProvider services={services}>
            <App />
        </ServiceProvider>
    </Provider>,
    document.getElementById("app"),
);
