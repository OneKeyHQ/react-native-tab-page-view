import { requireNativeComponent, Animated } from 'react-native';

const NativeSelectedLabel = requireNativeComponent('SelectedLabel');

const AnimatedSelectedLabel =
  Animated.createAnimatedComponent(NativeSelectedLabel);

export default AnimatedSelectedLabel;
