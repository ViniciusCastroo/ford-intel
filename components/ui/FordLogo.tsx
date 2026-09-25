import { Image, type ImageStyle, type StyleProp } from 'react-native';

const LOGO = require('../../assets/images/Ford_logo.webp');
const PROPORCAO = 860 / 310;

interface FordLogoProps {
  height?: number;
  style?: StyleProp<ImageStyle>;
}

export function FordLogo({ height = 32, style }: FordLogoProps) {
  return (
    <Image
      source={LOGO}
      style={[{ height, width: height * PROPORCAO }, style]}
      resizeMode="contain"
      accessibilityLabel="Ford"
    />
  );
}
