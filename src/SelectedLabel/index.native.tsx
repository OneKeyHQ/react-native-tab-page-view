import React, { Component } from 'react';
import {
  requireNativeComponent,
  Animated,
  Platform,
  processColor,
} from 'react-native';

const NativeSelectedLabel = requireNativeComponent('SelectedLabel');

const AnimatedSelectedLabel =
  Animated.createAnimatedComponent(NativeSelectedLabel);

export default AnimatedSelectedLabel;
