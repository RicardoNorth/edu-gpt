declare module 'react-native-image-viewing' {
  import * as React from 'react';
  import { ImageURISource, ImageProps } from 'react-native';

  export interface ImageSource extends ImageURISource {}

  export interface Props {
    images: ImageSource[];
    imageIndex: number;
    visible: boolean;
    onRequestClose: () => void;

    /** 这些是官方 README 支持却漏写的 ↓ */
    ImageComponent?: React.ComponentType<ImageProps>;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    /* 如还有其它漏写的就继续补：backgroundColor、HeaderComponent … */
  }

  const ImageViewing: React.FC<Props>;
  export default ImageViewing;
}
