import {VoyagerChartConfig} from '../models/chartConfig';
import {ReduxAction} from './redux-action';

export type ChartConfigAction = SetChartConfig;

export const SET_CHART_CONFIG = 'SET_CHART_CONFIG';
export type SetChartConfig = ReduxAction<typeof SET_CHART_CONFIG, {
  chartConfig: VoyagerChartConfig
}>;
