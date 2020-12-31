import React, { Component } from 'react';
import { Alert, Container } from 'reactstrap';

class InvalidGamePage extends Component {
    render() {
        return (
            <div>
                <Container>
                    <Alert color="danger" style={{ marginTop: '2rem' }}>
                        Invalid room ID. Please make sure to create the room in the lobby first.
                    </Alert>
                </Container>
            </div>
        );
    }
}

export default InvalidGamePage;
