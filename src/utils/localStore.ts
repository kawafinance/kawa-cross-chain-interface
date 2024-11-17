export const saveChainConfigIdToLocalStorage = (config) => {
    try {
        localStorage.setItem('chainConfigId', JSON.stringify(config));
    } catch (error) {
        // Handle exceptions, possibly a quota exceeded
        console.error("Could not save state", error);
    }
};
export const loadChainConfigIdFromLocalStorage = () => {
    try {
        const serializedConfig = localStorage.getItem('chainConfigId');
        if (serializedConfig === null) {
            return undefined;
        }
        return JSON.parse(serializedConfig);
    } catch (error) {
        console.error("Could not retrieve state", error);
        return undefined;
    }
};
