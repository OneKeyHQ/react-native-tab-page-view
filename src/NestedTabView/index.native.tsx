import { forwardRef, useImperativeHandle, useRef } from 'react';

import {
  UIManager,
  findNodeHandle,
  Platform,
  requireNativeComponent,
} from 'react-native';

const BaseNestedTabView = requireNativeComponent('NestedTabView');

function NestedTabViewContainer(props: any, forwardRef: any) {
  const point = useRef({ x: 0, y: 0 });
  const ref = useRef<{ _nativeTag?: number }>();

  useImperativeHandle(
    forwardRef,
    () => ({
      setVerticalScrollEnabled: (scrollEnabled: boolean) => {
        if (ref?.current?._nativeTag) {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(ref.current._nativeTag),
            UIManager.getViewManagerConfig('NestedTabView').Commands
              .setVerticalScrollEnabled as number,
            [scrollEnabled]
          );
        }
      },
      scrollToTop: () => {
        if (Platform.OS === 'ios' && ref?.current?._nativeTag) {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(ref.current._nativeTag),
            UIManager.getViewManagerConfig('NestedTabView').Commands
              .scrollToTop as number,
            []
          );
        }
      }
    }),
    []
  );

  return (
    // @ts-ignore
    <BaseNestedTabView
      ref={ref}
      onStartShouldSetResponderCapture={(e: any) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        point.current = { x, y };
        return false;
      }}
      onMoveShouldSetResponderCapture={(e: any) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        const diffX = Math.abs(x - point.current.x);
        const diffY = Math.abs(y - point.current.y);
        return diffX + diffY > 5 && diffX > diffY;
      }}
      {...props}
    />
  );
}

export default forwardRef<any, any>(NestedTabViewContainer);
