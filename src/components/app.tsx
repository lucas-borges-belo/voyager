
import * as React from 'react';
import {Dispatch} from 'redux';
import {ActionCreators} from 'redux-undo';
import {Data} from 'vega-lite/build/src/data';
import { FacetedCompositeUnitSpec, TopLevel } from 'vega-lite/build/src/spec';
import {datasetLoad, SET_APPLICATION_STATE, SET_CONFIG, SET_CHART_CONFIG} from '../actions';
import {SPEC_LOAD} from '../actions/shelf';
import {VoyagerConfig} from '../models/config';
import {VoyagerChartConfig} from '../models/chartConfig';
import {State} from '../models/index';
import {AppRoot} from './app-root';

export interface Props extends React.Props<App> {
  config?: VoyagerConfig;
  data?: Data;
  applicationState?: Readonly<State>;
  spec?: TopLevel<FacetedCompositeUnitSpec>;
  filename?: string;
  dispatch: Dispatch<State>;
}

export class App extends React.PureComponent<Props, {}> {

  constructor(props: any) {
    super(props);
  }

  public componentWillUpdate(nextProps: Props) {
    this.update(nextProps);
  }

  public componentWillMount() {
    // Clear history as redux-undo seems to always put the first action after
    // an init into the history. This ensures we start with a fresh history once
    // the app is about to start.
    this.props.dispatch(ActionCreators.clearHistory());
    this.update(this.props);
  }

  public render() {
    return <AppRoot/>;
  }

  private async update(nextProps: Props) {
    const chartConfig = await fetch('https://raw.githubusercontent.com/belo-research/vega/main/config.json')
      .then(async (res) => {
        const vegaliteConfig = await res.json();
        return vegaliteConfig;
      });

    const { data, config, applicationState, dispatch, spec, filename } = nextProps;

    console.log('>> DATA from update:',data);

    if (data) {
      this.setData(data, filename);
    }

    if(chartConfig){
      localStorage.setItem('chartConfig', JSON.stringify(chartConfig));
      this.setChartConfig(chartConfig);
    }

    if(config){
      this.setConfig({
        ...config
      });
    }

    if (spec) {
      // Note that this will overwrite other passed in props
      this.setSpec(spec, filename);
    }

    if (applicationState) {
      // Note that this will overwrite other passed in props
      this.setApplicationState(applicationState);
    }
  }

  private setData(data: Data, filename: string): any {
    return this.props.dispatch(datasetLoad(filename, data));
  }

  private setChartConfig(chartConfig: VoyagerChartConfig) {
    this.props.dispatch({
      type: SET_CHART_CONFIG,
      payload: {
        chartConfig,
      }
    });
  }

  private setConfig(config: VoyagerConfig) {
    this.props.dispatch({
      type: SET_CONFIG,
      payload: {
        config,
      }
    });
  }

  private setSpec(spec: TopLevel<FacetedCompositeUnitSpec>, filename: string) {
    if (spec.data) {
    console.log('## SET DATA spec.data !!!',spec.data);

      this.setData(spec.data, filename)
        .then(
          () => {
            this.shelfSpecLoad(spec);
          },
          (err: any) => {
            throw new Error('error setting data for spec:' + err.toString());
          }
        );
    } else {
      this.shelfSpecLoad(spec);
    }
  }

  private shelfSpecLoad(spec: TopLevel<FacetedCompositeUnitSpec>) {
    this.props.dispatch({
      type: SPEC_LOAD,
      payload: {
        spec,
        keepWildcardMark: false
      }
    });
  }

  private setApplicationState(state: Readonly<State>): void {
    this.props.dispatch({
      type: SET_APPLICATION_STATE,
      payload: {
        state,
      }
    });
  }
}
