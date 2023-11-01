import React, { Component } from 'react';
import { View, Animated, LayoutChangeEvent, LayoutRectangle, DimensionValue } from 'react-native';

interface PageHeaderCursorProps {
  data: any[];
  cursorStyle?: object;
  scrollPageIndexValue: Animated.Value;
  renderCursor?: () => React.ReactElement | null;
}

export default class PageHeaderCursor extends Component<PageHeaderCursorProps> {

  override state: {
	  itemContainerLayoutList: (LayoutRectangle | undefined)[];
  } = {
	  itemContainerLayoutList: this.props.data.map(() => undefined),
  }

  public onLayoutItemContainer = (event: LayoutChangeEvent, item: any, index: number) => {
    const itemContainerLayout = event.nativeEvent.layout;
    if (itemContainerLayout == this.state.itemContainerLayoutList[index]) {
      return;
    }
    this.state.itemContainerLayoutList[index] = itemContainerLayout;
    let fullLoadItemContainerLayout = true;
    this.state.itemContainerLayoutList.forEach((item) => {
      if (!item) {
        fullLoadItemContainerLayout = false;
      }
    });
    if (fullLoadItemContainerLayout) {
      this.forceUpdate();
    }
  };

  private _findFixCursorWidth = () => {
    const { width } = this.props.cursorStyle as any
    return width;
  };

  private _reloadPageIndexValue = (isWidth: boolean) => {
    const fixCursorWidth = this._findFixCursorWidth();
    const rangeList = (isIndex: boolean) => {
      const itemList = [isIndex ? -1 : 0];
      itemList.push(
        ...this.state.itemContainerLayoutList.map((item, index) => {
          if (isIndex) {
            return index;
          } else {
            if (item) {
              if (fixCursorWidth) {
                return isWidth ? fixCursorWidth : item.x + (item.width - fixCursorWidth) / 2.0;
              } else {
                return isWidth ? item.width : item.x + item.width / 2.0;
              }
            } else {
              return 0;
            }
          }
        })
      );
      itemList.push(isIndex ? itemList.length - 1 : 0);
      return itemList;
    };

    return this.props.scrollPageIndexValue.interpolate({
      inputRange: rangeList(true),
      outputRange: rangeList(false),
    });
  };

  override shouldComponentUpdate(nextProps: PageHeaderCursorProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        itemContainerLayoutList: nextProps.data.map(() => false),
      });
      return true;
    }
    return false;
  }

  override render() {
    const fixCursorWidth = this._findFixCursorWidth();
    const translateX = this._reloadPageIndexValue(false);
    const scaleX = this._reloadPageIndexValue(true);

    const containerStyle: Animated.WithAnimatedObject<any> = {
      transform: [{ translateX }, fixCursorWidth ? { scale: 1 } : { scaleX }],
      width: fixCursorWidth ?? 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
    };

    const contentStyle = [
      this.props.cursorStyle,
      { width: fixCursorWidth ?? 1 },
    ];

    return (
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
        <Animated.View style={containerStyle}>
          {this.props.renderCursor ? this.props.renderCursor() : <View style={contentStyle}></View>}
        </Animated.View>
      </View>
    );
  }
}
