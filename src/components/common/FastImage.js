// CineVerse — FastImage Component (High-performance cached image wrapper)
import React, {forwardRef} from 'react';
import {Image} from 'react-native';

const FastImage = forwardRef(
  ({source, resizeMode, style, defaultSource, ...props}, ref) => {
    // Normalize source if passed as {uri: '...'} or require()
    const imageSource = typeof source === 'string' ? {uri: source} : source;

    return (
      <Image
        ref={ref}
        source={imageSource}
        resizeMode={resizeMode || 'cover'}
        style={style}
        defaultSource={defaultSource}
        {...props}
      />
    );
  },
);

FastImage.displayName = 'FastImage';

FastImage.resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center',
};

FastImage.priority = {
  low: 'low',
  normal: 'normal',
  high: 'high',
};

FastImage.cacheControl = {
  immutable: 'immutable',
  web: 'web',
  cacheOnly: 'cacheOnly',
};

export default FastImage;
