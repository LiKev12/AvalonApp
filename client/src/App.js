import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { loadUser } from './actions/authActions';
import AppNavbar from './components/App/AppNavbar/AppNavbar';
import AppRoutes from './components/App/AppRoutes/AppRoutes';

class App extends Component {
    componentDidMount() {
        console.log(`Plz don't hack me ;D`);
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <AppNavbar />
                    <AppRoutes />
                </Router>
            </Provider>
        );
    }
}

export default App;
