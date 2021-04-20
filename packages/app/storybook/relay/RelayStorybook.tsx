import React, { ReactNode, useEffect, useState } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { IEnvironment } from 'relay-runtime';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

type RelayStorybookProps = {
    children: ReactNode;
    mockResolvers?: Record<string, unknown>;
};

export const RelayStorybook = ({
    children,
    mockResolvers = {}
}: RelayStorybookProps) => {
    const [env] = useState<IEnvironment>(createMockEnvironment);

    console.log(env);

    useEffect(() => {
        try {
            env.mock.resolveMostRecentOperation((operation) =>
                MockPayloadGenerator.generate(operation, mockResolvers)
            );
        } catch (err) {
            console.error(err.message);
        }
    }, [env.mock, mockResolvers]);

    return (
        <RelayEnvironmentProvider environment={env}>
            {children}
        </RelayEnvironmentProvider>
    );
};
