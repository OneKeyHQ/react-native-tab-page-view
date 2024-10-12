import React, { Component } from 'react';
import type { RefObject } from 'react';
import {
  View,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  PixelRatio,
} from 'react-native';
import type { ScrollViewProps } from 'react-native';
import SelectedLabel from './SelectedLabel';
import PageHeaderCursor from './PageHeaderCursor';

interface PageHeaderViewProps extends ScrollViewProps {
  data: any[];
  itemContainerStyle?: object;
  initialScrollIndex?: number;
  renderItem?: (
    item: any,
    index: number,
    titleStyle: object
  ) => React.ReactNode;
  titleFromItem?: (item: any, index: number) => string;
  itemTitleStyle?: object;
  itemTitleNormalStyle?: object;
  itemTitleSelectedStyle?: object;
  cursorStyle?: object;
  renderCursor?: () => React.ReactElement | null;
  onSelectedPageIndex?: (index: number) => void;
  selectedPageIndexDuration?: number;
  shouldSelectedPageIndex?: (pageIndex: number) => boolean;
  scrollContainerStyle?: object;
  contentContainerStyle?: object;
  containerStyle?: object;
}

export default class PageHeaderView extends Component<PageHeaderViewProps> {
  private scrollPageIndex = this.props.initialScrollIndex ?? 0;
  private scrollPageIndexValue = new Animated.Value(this.scrollPageIndex, {
    useNativeDriver: false,
  });
  private nextScrollPageIndex = -1;
  private shouldHandlerAnimationValue = true;
  private itemConfigList = this.props.data.map((_: any) => ({
    _animtedEnabledValue: new Animated.Value(1),
    _containerRef: React.createRef<View>(),
  }));
  private itemContainerStyle = () =>
    ({
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...this.props.itemContainerStyle,
    } as { flex?: number } & object);
  private itemTitleNormalStyle: () => {
    fontSize: number;
    color: string;
  } & object = () => ({
    fontSize: 16,
    color: '#333',
    ...this.props.itemTitleStyle,
    ...this.props.itemTitleNormalStyle,
  });
  private itemTitleSelectedStyle: () => {
    fontSize: number;
    color: string;
  } & object = () => ({
    ...this.itemTitleNormalStyle(),
    fontSize: 20,
    color: '#666',
    ...this.props.itemTitleSelectedStyle,
  });
  private cursorStyle = () => ({
    position: 'absolute',
    bottom: 0,
    height: 1 / PixelRatio.get(),
    backgroundColor: '#999',
    ...this.props.cursorStyle,
  });
  private scrollView: RefObject<ScrollView> = React.createRef();
  private cursor: RefObject<PageHeaderCursor> = React.createRef();
  private scrollViewWidth = 0;

  static defaultProps: PageHeaderViewProps = {
    data: [],
    horizontal: true,
    selectedPageIndexDuration: 250,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    contentInsetAdjustmentBehavior: 'never',
    automaticallyAdjustContentInsets: false,
    bounces: false,
  };

  public bindScrollPageIndexValue = (scrollPageIndexValue: Animated.Value) => {
    this.scrollPageIndexValue.removeAllListeners();
    this.scrollPageIndexValue = scrollPageIndexValue;
    this.shouldHandlerAnimationValue = false;
    this.addScrollPageIndexListener();
    this.forceUpdate();
  };

  private addScrollPageIndexListener = () => {
    this.scrollPageIndexValue.addListener(({ value }) => {
      const scrollIsStop = Math.floor(value) === value;
      if (
        this.props.shouldSelectedPageIndex &&
        this.nextScrollPageIndex === -1 &&
        scrollIsStop &&
        value !== this.scrollPageIndex &&
        !this.props.shouldSelectedPageIndex(value)
      ) {
        this.props?.onSelectedPageIndex?.(this.scrollPageIndex);
        this.scrollPageIndex = value;
        return;
      }
      if (
        this.nextScrollPageIndex >= 0 &&
        Math.abs(this.nextScrollPageIndex - value) <= 0.01
      ) {
        this.nextScrollPageIndex = -1;
        this.itemConfigList.map((item, _index) => {
          item._animtedEnabledValue.setValue(1);
        });
      }
      const newPageIndex = Math.round(value);
      if (newPageIndex != this.scrollPageIndex && scrollIsStop) {
        const itemLayout = this?.cursor?.current?.state
          ?.itemContainerLayoutList?.[newPageIndex] ?? { x: 0, width: 0 };
        this?.scrollView?.current?.scrollTo({
          x: itemLayout.x + itemLayout.width / 2.0 - this.scrollViewWidth / 2.0,
        });
        this.scrollPageIndex = newPageIndex;
      }
    });
  };

  constructor(props: PageHeaderViewProps) {
    super(props);
    this.addScrollPageIndexListener();
  }

  override componentWillUnmount() {
    this.scrollPageIndexValue.removeAllListeners();
  }

  private _animation = (
    key: Animated.Value,
    value: number,
    duration: number = 0,
    native: boolean = true
  ) => {
    Animated.timing(key, {
      toValue: value,
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: native,
    }).start();
  };

  private _itemTitleProps = (item: any, index: number) => {
    let fontScale =
      1 +
      (this.itemTitleSelectedStyle().fontSize -
        this.itemTitleNormalStyle().fontSize) /
        this.itemTitleNormalStyle().fontSize;
    if (fontScale === 1) {
      fontScale = 1.0001;
    }
    let scale = this.scrollPageIndexValue.interpolate({
      inputRange: [index - 2, index - 1, index, index + 1, index + 2],
      outputRange: [1, 1, fontScale, 1, 1],
    });
    const enabled =
      this?.itemConfigList?.[index]?._animtedEnabledValue ??
      new Animated.Value(1);
    scale = Animated.add(
      Animated.multiply(scale, enabled),
      Animated.multiply(1, Animated.subtract(1, enabled))
    );
    const normalColor = this.itemTitleNormalStyle().color;
    const selectedColor = this.itemTitleSelectedStyle().color;
    return {
      ...this.itemTitleNormalStyle(),
      normalColor,
      selectedColor,
      selectedScale: fontScale,
      text: this.props.titleFromItem
        ? this.props.titleFromItem(item, index)
        : item,
      style: {
        ...this.itemTitleNormalStyle(),
        transform: [{ scale }],
      },
    };
  };

  private _renderTitle = (item: any, index: number) => {
    return <SelectedLabel {...this._itemTitleProps(item, index)} />;
  };

  private _itemDidTouch = (_: any, index: number) => {
    if (this.props.shouldSelectedPageIndex) {
      const result = this.props.shouldSelectedPageIndex(index);
      if (result === false) {
        return;
      }
    }
    this.nextScrollPageIndex = index;
    this.itemConfigList.map((item, _index) => {
      item._animtedEnabledValue.setValue(
        _index === index || _index === this.scrollPageIndex ? 1 : 0
      );
    });
    if (this.shouldHandlerAnimationValue) {
      this._animation(
        this.scrollPageIndexValue,
        index,
        this.props.selectedPageIndexDuration,
        false
      );
    }
    this.props.onSelectedPageIndex?.(index);
  };

  private _renderItem = (item: any, index: number) => {
    let content =
      this.props.renderItem != null
        ? this.props.renderItem(item, index, this._itemTitleProps(item, index))
        : this._renderTitle(item, index);
    return (
      <Pressable
        key={index}
        ref={this?.itemConfigList?.[index]?._containerRef}
        style={this.itemContainerStyle()}
        onPress={() => this._itemDidTouch(item, index)}
      >
        {content}
      </Pressable>
    );
  };

  private _renderCursor = () => {
    return (
      <PageHeaderCursor
        ref={this.cursor}
        data={this.props.data}
        scrollPageIndexValue={this.scrollPageIndexValue}
        renderCursor={this.props.renderCursor}
        cursorStyle={this.cursorStyle()}
      />
    );
  };

  override shouldComponentUpdate(nextProps: PageHeaderViewProps) {
    if (nextProps.data !== this.props.data) {
      this.nextScrollPageIndex = -1;
      this.itemConfigList = nextProps.data.map((_: any) => ({
        _animtedEnabledValue: new Animated.Value(1),
        _containerRef: React.createRef<View>(),
      }));
      return true;
    }
    return false;
  }

  override render() {
    const { style, ...restProps } = this.props;
    return (
      <View style={style}>
        <ScrollView
          onContentSizeChange={(width, height) => {
            this?.cursor?.current?.reloadItemListContainerLayout(
              this.itemConfigList.map((item) => item._containerRef),
              this.scrollView as any
            );
            this?.props?.onContentSizeChange?.(width, height);
          }}
          onLayout={(event) => {
            this.scrollViewWidth = event.nativeEvent.layout.width;
            this?.props?.onLayout?.(event);
          }}
          style={this.props.containerStyle}
          {...restProps}
          contentContainerStyle={[
            { width: this.itemContainerStyle()?.flex ? '100%' : null },
            this.props.scrollContainerStyle,
          ]}
          ref={this.scrollView}
        >
          <View
            style={[
              { minWidth: '100%', flexDirection: 'row', alignItems: 'center' },
              this.props.contentContainerStyle,
            ]}
          >
            {this._renderCursor()}
            {this.props.data?.map((item, index) => {
              return this._renderItem(item, index);
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}
