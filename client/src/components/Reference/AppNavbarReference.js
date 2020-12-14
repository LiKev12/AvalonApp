import React, { Component, Fragment } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Container } from 'reactstrap';

import RegisterModal from '../Auth/RegisterModal';
import LoginModal from '../Auth/LoginModal';
import LogoutLink from '../App/Navbar/NavLinks/LogoutLink';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class AppNavbar extends Component {
    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;
        // const username = sessionStorage.getItem('user_name');

        const authLinks = (
            <Fragment>
                <NavItem>
                    <span className="navbar-text mr-3">{/* <strong>{user ? user.name : null}</strong> */}</span>
                    <span>{user ? 'UserExists' : null}</span>
                </NavItem>
                <NavItem>
                    <LogoutLink />
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <RegisterModal />
                </NavItem>

                <NavItem>
                    <LoginModal />
                </NavItem>
            </Fragment>
        );
        return (
            <div>
                <Navbar color="dark" dark expand="sm">
                    <Container>
                        <NavbarBrand href="/">Avalon</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                {isAuthenticated ? authLinks : guestLinks}
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

AppNavbar.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(AppNavbar);
