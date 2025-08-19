// Device management configuration
let deviceConfig = {
    maxDevicesPerUser: 2
};

// Function to update device limit
export const updateDeviceLimit = (newLimit) => {
    if (typeof newLimit === 'number' && newLimit >= 1 && newLimit <= 10) {
        deviceConfig.maxDevicesPerUser = newLimit;
        return true;
    }
    return false;
};

// Function to get current device limit
export const getDeviceLimit = () => {
    return deviceConfig.maxDevicesPerUser;
};

// Function to get full device config
export const getDeviceConfig = () => {
    return { ...deviceConfig };
};

export default deviceConfig;
