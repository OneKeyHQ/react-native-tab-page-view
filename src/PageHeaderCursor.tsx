import React, { Component } from 'react';
import type { RefObject } from 'react';
import { View, Animated } from 'react-native';
import type { LayoutRectangle } from 'react-native';

interface PageHeaderCursorProps {
  data: any[];
  cursorStyle?: object;
  scrollPageIndexValue: Animated.Value;
  renderCursor?: () => React.ReactElement | null;
}

interface PageHeaderCursorState {
  itemContainerLayoutList: (LayoutRectangle | undefined)[];
}

export default class PageHeaderCursor extends Component<PageHeaderCursorProps> {
  override state: PageHeaderCursorState = {
    itemContainerLayoutList: this.props.data.map(() => undefined),
  };

  public reloadItemListContainerLayout = (
    refList: Array<RefObject<View>>,
    scrollRef: RefObject<View>
  ) => {
    this.state.itemContainerLayoutList = this.props.data.map(() => undefined);
    refList.map((ref, index) => {
      ref?.current?.measureLayout(
        scrollRef.current as any,
        (x: number, y: number, width: number, height: number) => {
          if (x + width <= 0) {
            return;
          }
          this.state.itemContainerLayoutList[index] = { x, y, width, height };
          if (
            this.state.itemContainerLayoutList.findIndex((item) => !item) == -1
          ) {
            this.setState(this.state);
          }
        }
      );
    });
  };

  private _findPercentCursorWidth = () => {
    const { width } = this.props.cursorStyle as any;
    if (typeof width === 'string') {
      return width.match(/(\d+(\.\d+)?)%/)?.[1];
    }
    return null;
  };

  private _findFixCursorWidth = () => {
    const { width } = this.props.cursorStyle as any;
    if (this._findPercentCursorWidth()) {
      return null;
    }
    return width;
  };

  private _reloadPageIndexValue = (isWidth: boolean) => {
    const fixCursorWidth = this._findFixCursorWidth();
    const { left = 0, right = 0 } = this?.props?.cursorStyle as any;
    const percentWidth = this._findPercentCursorWidth();
    const rangeList = (isIndex: boolean) => {
      const itemList = [isIndex ? -1 : 0];
      itemList.push(
        ...this.state.itemContainerLayoutList.map((item, index) => {
          if (isIndex) {
            return index;
          } else {
            if (item) {
              if (fixCursorWidth) {
                return isWidth
                  ? fixCursorWidth
                  : item.x + (item.width - fixCursorWidth) / 2.0;
              } else {
                const width = item.width - left - right;
                return isWidth
                  ? (width * Number(percentWidth ?? 100)) / 100
                  : item.x + left;
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

  override shouldComponentUpdate(
    nextProps: PageHeaderCursorProps,
    nextState: PageHeaderCursorState
  ) {
    if (
      nextProps.data !== this.props.data ||
      nextProps.cursorStyle !== this.props.cursorStyle ||
      nextState !== this.state
    ) {
      return true;
    }
    return false;
  }

  override render() {
    const fixCursorWidth = this._findFixCursorWidth();
    const translateX = this._reloadPageIndexValue(false);
    const widthX = this._reloadPageIndexValue(true);

    const containerStyle: Animated.WithAnimatedObject<any> = {
      transform: [{ translateX }],
      width: fixCursorWidth ?? widthX,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
    };

    const contentStyle = [
      this.props.cursorStyle,
      { left: null, right: null, width: fixCursorWidth ?? widthX },
    ];

    return (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          opacity:
            this.state.itemContainerLayoutList.findIndex((item) => !item) == -1
              ? 1
              : 0,
        }}
      >
        <Animated.View style={containerStyle}>
          {this.props.renderCursor ? (
            this.props.renderCursor()
          ) : (
            <Animated.View style={contentStyle} />
          )}
        </Animated.View>
      </View>
    );
  }
}
