import React from 'react';
import type { RefObject } from 'react';
import { Animated } from 'react-native';
import PageHeaderView from './PageHeaderView';
import PageContentView from './PageContentView';

interface PageManagerProps {
  data: any[];
  initialScrollIndex?: number;
  onSelectedPageIndex?: (pageIndex: number) => void;
}

export default class PageManager extends React.Component<PageManagerProps> {
  static defaultProps: PageManagerProps = {
    data: [],
    initialScrollIndex: 0,
    onSelectedPageIndex: () => {},
  };

  constructor(props: PageManagerProps) {
    super(props);
    this.pageIndex = props.initialScrollIndex ?? 0;
  }

  headerView: RefObject<PageHeaderView> | null = React.createRef();
  contentView: RefObject<PageContentView> | null = React.createRef();
  pageIndex: number = -1;

  renderHeaderView = (props: any) => {
    return (
      <PageHeaderView
        ref={this.headerView}
        {...this.props}
        {...props}
        onSelectedPageIndex={(pageIndex: number) => {
          this?.contentView?.current?.scrollPageIndex(pageIndex);
          props?.onSelectedPageIndex && props.onSelectedPageIndex(pageIndex);
        }}
      />
    );
  };

  renderContentView = (props: any) => {
    return (
      <PageContentView
        ref={this.contentView}
        {...this.props}
        {...props}
        onInitScrollPageIndexValue={(scrollPageIndexValue) => {
          this?.headerView?.current?.bindScrollPageIndexValue(
            scrollPageIndexValue as Animated.Value
          );
          scrollPageIndexValue.addListener(({ value }) => {
            let willReloadPageIndex = Math.round(value);
            if (willReloadPageIndex !== this.pageIndex) {
              this.pageIndex = willReloadPageIndex;
              this.props.onSelectedPageIndex?.(this.pageIndex);
            }
          });
        }}
      />
    );
  };
}
