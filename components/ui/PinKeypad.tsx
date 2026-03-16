import React from 'react'
import { AsteriskIcon } from 'dash-ui-kit/react-native'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

export const PIN_LENGTH = 6

interface PinDotsProps {
  filled: number
  length?: number
  error?: boolean
}

export function PinDots({ filled, length = PIN_LENGTH, error = false }: PinDotsProps) {
  return (
    <View style={dotStyles.container}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={dotStyles.dot}>
          {i < filled && (
            <AsteriskIcon
              size={20}
              color={error ? '#FF3B30' : '#0C1C33'}
            />
          )}
        </View>
      ))}
    </View>
  )
}

interface PinKeypadProps {
  onPress: (digit: string) => void
  onDelete: () => void
  leftAction?: React.ReactNode
  disabled?: boolean
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['__left__', '0', '__back__'],
]

export function PinKeypad({ onPress, onDelete, leftAction, disabled = false }: PinKeypadProps) {
  return (
    <View style={keypadStyles.container}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={keypadStyles.row}>
          {row.map((key, ci) => {
            if (key === '__left__') {
              return (
                <View key={ci} style={keypadStyles.button}>
                  {leftAction}
                </View>
              )
            }

            if (key === '__back__') {
              return (
                <Pressable
                  key={ci}
                  onPress={onDelete}
                  disabled={disabled}
                  style={({ pressed }) => [
                    keypadStyles.button,
                    pressed && keypadStyles.buttonPressed,
                  ]}
                >
                  <Svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                    <Path
                      d="M10.5 0C9.58 0 8.72 0.46 8.21 1.22L0.5 11L8.21 20.78C8.72 21.54 9.58 22 10.5 22H24.5C26.43 22 28 20.43 28 18.5V3.5C28 1.57 26.43 0 24.5 0H10.5ZM17.29 7.29L19.5 9.5L21.71 7.29L23.12 8.71L20.91 10.91L23.12 13.12L21.71 14.53L19.5 12.32L17.29 14.53L15.88 13.12L18.09 10.91L15.88 8.71L17.29 7.29Z"
                      fill="rgba(12, 28, 51, 0.64)"
                    />
                  </Svg>
                </Pressable>
              )
            }

            return (
              <Pressable
                key={ci}
                onPress={() => onPress(key)}
                disabled={disabled}
                style={({ pressed }) => [
                  keypadStyles.button,
                  keypadStyles.buttonFilled,
                  pressed && keypadStyles.buttonPressed,
                ]}
              >
                <Text style={keypadStyles.digit}>{key}</Text>
              </Pressable>
            )
          })}
        </View>
      ))}
    </View>
  )
}

const dotStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
    alignItems: 'center',
  },
  dot: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(12, 28, 51, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(12, 28, 51, 0.08)',
    boxShadow: 'inset 0px 2px 8px rgba(12, 28, 51, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const keypadStyles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  button: {
    flex: 1,
    height: 82,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFilled: {
    backgroundColor: 'rgba(12, 28, 51, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(12, 28, 51, 0.06)',
    boxShadow: 'inset 0px 2px 6px rgba(12, 28, 51, 0.05)',
  },
  buttonPressed: {
    backgroundColor: 'rgba(12, 28, 51, 0.12)',
  },
  digit: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '400',
    color: '#0C1C33',
  },
})
