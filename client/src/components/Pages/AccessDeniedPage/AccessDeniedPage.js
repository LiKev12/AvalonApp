import React, { Component } from 'react';
import { Alert, Container } from 'reactstrap';

class AccessDeniedPage extends Component {
    render() {
        return (
            <div>
                <Container>
                    <Alert color="danger" style={{ marginTop: '2rem' }}>
                        Please log in to view.
                    </Alert>
                </Container>
            </div>
        );
    }
}

export default AccessDeniedPage;
