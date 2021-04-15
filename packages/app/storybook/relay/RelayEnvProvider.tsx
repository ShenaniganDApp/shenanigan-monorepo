import React, { useEffect, useState } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

interface MockResolverContext {
    parentType?: string;
    name?: string;
    alias?: string;
    path?: ReadonlyArray<string>;
    args?: Record<string, unknown>;
}

type MockResolver = (
    context: MockResolverContext,
    generateId: () => number
) => unknown;

export interface MockResolvers {
    [typeName: string]: MockResolver;
}

export const RelayEnvProvider: React.FC<{
    mockResolvers?: MockResolvers;
}> = ({ children, mockResolvers = {} }) => {
    const [env] = useState(createMockEnvironment);

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
