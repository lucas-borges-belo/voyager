import {
  Action,
  SET_CHART_CONFIG,
} from '../actions';
import {DEFAULT_VOYAGER_CHART_CONFIG, VoyagerChartConfig} from '../models/chartConfig';

export function chartConfigReducer(state: Readonly<VoyagerChartConfig> = DEFAULT_VOYAGER_CHART_CONFIG, action: Action): VoyagerChartConfig {
  switch (action.type) {
    case SET_CHART_CONFIG:
      const {chartConfig} = action.payload;
      const res = {
        ...state,
        ...chartConfig,
      };
      return res;
  }
  return state;
}

