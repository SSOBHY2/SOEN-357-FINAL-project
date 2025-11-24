import { useMemo } from "react";

type Environment = 'dev' | 'production';

export function useBackendUrl(env?: Environment) {
    const environment = env || (import.meta.env.MODE === 'production' ? 'dev' : 'dev');

    if (environment !== 'dev' && environment !== 'production') {
        throw new Error(`Invalid environment: ${environment}`);
    }

    const backendUrl = useMemo(() => {
        return environment === 'production'
            ? import.meta.env.VITE_BACKEND_URL_PROD
            : import.meta.env.VITE_BACKEND_URL_DEV
    }, [environment]);

    return backendUrl;
}
