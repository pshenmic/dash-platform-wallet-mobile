import { StyleSheet } from 'react-native'

export const pinScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topImageSection: {
    position: 'absolute',
    top: -200,
    left: 0,
    right: 0,
    height: 340,
    zIndex: 0,
  },
  barsImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 200,
    zIndex: 1,
  },
  title: {
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -1.2,
    color: '#0C1C33',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(12, 28, 51, 0.5)',
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 80,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
})
