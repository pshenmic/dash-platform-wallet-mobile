import { StyleSheet, View } from 'react-native'
import Svg, { Defs, Ellipse, FeGaussianBlur, Filter, RadialGradient, Stop } from 'react-native-svg'

export function PinScreenBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width="100%" height="240" viewBox="0 0 390 240" preserveAspectRatio="xMidYMid meet">
        <Defs>
          <RadialGradient id="radGrad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#4C7EFF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4C7EFF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="radGrad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#4C7EFF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4C7EFF" stopOpacity="0" />
          </RadialGradient>
          <Filter id="blur1" x="-60%" y="-60%" width="220%" height="220%">
            <FeGaussianBlur stdDeviation="33" />
          </Filter>
          <Filter id="blur2" x="-60%" y="-60%" width="220%" height="220%">
            <FeGaussianBlur stdDeviation="33" />
          </Filter>
        </Defs>

        {/* Left blue glow */}
        <Ellipse
          cx="121"
          cy="80"
          rx="105"
          ry="70"
          fill="url(#radGrad1)"
          filter="url(#blur1)"
          opacity="0.65"
        />

        {/* Right blue glow */}
        <Ellipse
          cx="285"
          cy="110"
          rx="105"
          ry="92"
          fill="url(#radGrad2)"
          filter="url(#blur2)"
          opacity="0.55"
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 0,
  },
})
