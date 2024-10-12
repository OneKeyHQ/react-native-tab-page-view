import React, { Component } from 'react';
import { View, Animated, Dimensions, PixelRatio } from 'react-native';
import ContentFlatList from './ContentFlatList';
import type { RefObject } from 'react';
import type {
  FlatListProps,
  LayoutChangeEvent,
  ListRenderItemInfo,
} from 'react-native';

interface PageContentViewProps extends FlatListProps<any> {
  shouldSelectedPageAnimation?: boolean;
  onInitScrollPageIndexValue?: (
    scrollPageIndex: Animated.AnimatedDivision<string | number>
  ) => void;
}

interface PageContentViewState {
  scrollViewWidth: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class PageContentView extends Component<PageContentViewProps> {
  static defaultProps: PageContentViewProps = {
    data: [],
    renderItem: null,
    horizontal: true,
    initialNumToRender: 1,
    windowSize: 3,
    updateCellsBatchingPeriod: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    contentInsetAdjustmentBehavior: 'never',
    automaticallyAdjustContentInsets: false,
    bounces: false,
    pagingEnabled: true,
    shouldSelectedPageAnimation: true,
    keyExtractor: (_: any, index: number) => `${index}`,
  };

  override state: PageContentViewState = {
    scrollViewWidth: PixelRatio.roundToNearestPixel(SCREEN_WIDTH),
  };
  private _scrollViewWidthValue = new Animated.Value(
    this.state.scrollViewWidth
  );
  private _contentOffsetValueX = new Animated.Value(
    this.props.initialScrollIndex ?? 0
  );
  private _scrollPageIndexValue = Animated.divide(
    this._contentOffsetValueX,
    this._scrollViewWidthValue
  );
  private _event = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { x: this._contentOffsetValueX },
          layoutMeasurement: { width: this._scrollViewWidthValue },
        },
      },
    ],
    {
      useNativeDriver: false,
    }
  );
  private scrollView: RefObject<ContentFlatList> | null = React.createRef();

  override componentDidMount() {
    this.props.onInitScrollPageIndexValue?.(this._scrollPageIndexValue);
  }

  scrollPageIndex = (
    pageIndex: number,
    animated = this.props.shouldSelectedPageAnimation
  ) => {
    try {
      const scrollConfig = { index: pageIndex, animated: animated ?? false };
      this?.scrollView?.current?.scrollToIndex?.(scrollConfig);
    } catch (e) {}
  };

  private _onLayout = (event: LayoutChangeEvent) => {
    this.props.onLayout?.(event);
    const {
      nativeEvent: {
        layout: { width },
      },
    } = event;
    const reloadWidth = PixelRatio.roundToNearestPixel(width);
    if (
      reloadWidth !== this.state.scrollViewWidth &&
      reloadWidth > 0 &&
      (this?.props?.data?.length ?? 0) > 0
    ) {
      this._scrollViewWidthValue.setValue(reloadWidth);
      this.setState({ scrollViewWidth: reloadWidth }, () => {
        this?.scrollView?.current?.reloadScrollContainerWidth?.(reloadWidth);
      });
    }
  };

  private _renderItem = (info: ListRenderItemInfo<any>) => {
    return (
      <View style={{ width: this.state.scrollViewWidth, height: '100%' }}>
        {this.props.renderItem?.(info)}
      </View>
    );
  };

  override shouldComponentUpdate(
    nextProps: PageContentViewProps,
    nextState: PageContentViewState
  ) {
    return (
      nextProps.data != this.props.data ||
      nextState.scrollViewWidth != this.state.scrollViewWidth
    );
  }

  override render() {
    return (
      <ContentFlatList
        {...this.props}
        onLayout={this._onLayout}
        ref={this.scrollView}
        style={[{ width: '100%' }, this.props.style]}
        renderItem={this._renderItem}
        onScroll={this._event}
        getItemLayout={(_: any, index: number) => ({
          length: this.state.scrollViewWidth,
          offset: index * this.state.scrollViewWidth,
          index,
        })}
        scrollViewWidth={this.state.scrollViewWidth}
      />
    );
  }
}
