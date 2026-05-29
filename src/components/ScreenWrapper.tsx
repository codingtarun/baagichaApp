import { StyleSheet, View } from 'react-native';
import { Colors } from '../theme/colors';

type Props = {
  children: React.ReactNode;
};

export default function ScreenWrapper({ children }: Props) {
  return <View style={styles.base}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
