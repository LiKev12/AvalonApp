import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Container } from 'reactstrap';

import { HomeLink, AboutLink, RulesLink, StatsLink } from './NavLinks/NavLinks';
import LoginModal from '../../Auth/LoginModal';
import LogoutLink from './NavLinks/LogoutLink';
import RegisterModal from '../../Auth/RegisterModal';

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
        const { isAuthenticated } = this.props.auth;
        const displayedUserName = this.props.auth && this.props.auth.user ? this.props.auth.user.name : '';

        const sharedLinks = (
            <Fragment>
                <NavItem>
                    <HomeLink />
                </NavItem>
                <NavItem>
                    <AboutLink />
                </NavItem>
                <NavItem>
                    <RulesLink />
                </NavItem>
            </Fragment>
        );

        const authLinks = (
            <Fragment>
                <NavItem>
                    <span className="navbar-text mr-3">
                        <strong>{`Welcome ${displayedUserName}`}</strong>
                    </span>
                </NavItem>
                {sharedLinks}
                <NavItem>
                    <StatsLink />
                </NavItem>
                <NavItem>
                    <LogoutLink />
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                {sharedLinks}
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
