import * as React from 'react';
import { Container, Header } from 'semantic-ui-react';

export const Layout: React.FC = ({ children }) => {
    return (
        <>
            <Container style={{ marginTop: 40 }}>
                <Header textAlign="center" as='h1'>
                    COVID STATS FOR USA
                </Header>
                <br />

                {children}
                <br />
                <br />
                <br />
            </Container>
        </>
    );
};