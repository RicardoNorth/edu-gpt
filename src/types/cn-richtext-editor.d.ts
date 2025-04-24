declare module 'react-native-cn-richtext-editor/src/CNToolbar' {
  import * as React from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';

  interface CNToolbarProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
    iconSetContainerStyle?: StyleProp<ViewStyle>;
    size?: number;
    selectedTag?: string;
    selectedStyles?: string[];
    onStyleKeyPress?: (style: string) => void;
    iconSet?: any[];
  }

  const CNToolbar: React.FC<CNToolbarProps>;
  export default CNToolbar;
}
