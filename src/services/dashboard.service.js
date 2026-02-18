import { get } from './apiClient';

export const getDashboardStats = async () => get('/dashboard/stats');
export const getDashboardCharts = async () => get('/dashboard/charts');
