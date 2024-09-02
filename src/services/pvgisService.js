// src/services/pvgisService.js

import axios from 'axios';

const API_BASE_URL = 'https://re.jrc.ec.europa.eu/api/v5_2';

export const getPvPerformanceData = async (params) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/seriescalc`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from PVGIS API:', error);
        throw error;
    }
};
