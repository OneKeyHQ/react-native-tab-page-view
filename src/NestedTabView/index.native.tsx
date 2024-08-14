import { useRef } from 'react';

import { requireNativeComponent } from 'react-native';

const BaseNestedTabView = requireNativeComponent('NestedTabView');

function NestedTabViewContainer(props: any) {
  const point = useRef({ x: 0, y: 0 });
  return (
    // @ts-ignore
    <BaseNestedTabView
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

export default NestedTabViewContainer;
