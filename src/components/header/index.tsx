import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {InlineData} from 'vega-lite/build/src/data';
import * as idlLogo from '../../../images/idl-h56.png';
import * as logo from '../../../images/logo.png';
import {State} from '../../models/index';
import {selectData} from '../../selectors/dataset';
import {Controls} from './controls';
import * as styles from './header.scss';

export interface HeaderProps {
  data: InlineData;
}

export class HeaderBase extends React.PureComponent<HeaderProps, {}> {
  public render() {
    const {data} = this.props;

    return (
      <div styleName='header'>
        <a styleName='idl-logo' onClick={this.goHome}>
          <img src="https://www.belo.re/logo.svg"/>
        </a>
        {data && <Controls/>}
      </div>
    );
  }

  private openLink() {
    window.open('https://www.belo.re/');
  }

  private goHome() {
    window.open('/voyager');
  }
}

export const Header = connect(
  (state: State) => {
    return {
      data: selectData(state)
    };
  }
)(CSSModules(HeaderBase, styles));
