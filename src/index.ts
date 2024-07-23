import SelectedLabel from './SelectedLabel';
import PageHeaderView from './PageHeaderView';
import PageContentView from './PageContentView';
import PageManager from './PageManager';

import { requireNativeComponent, Platform } from 'react-native';

const NestedTabView =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? requireNativeComponent('NestedTabView')
    : undefined;

export {
  SelectedLabel,
  PageHeaderView,
  PageContentView,
  PageManager,
  NestedTabView,
};
