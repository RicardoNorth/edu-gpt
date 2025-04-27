import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EditAndSearchButtons() {
  const navigation = useNavigation();

  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={styles.outlinedButton}
        onPress={() => navigation.navigate('EditProfile' as never)}
      >
        <Text style={styles.buttonText}>编辑资料</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.outlinedButton}
        onPress={() => navigation.navigate('BrowseHistory' as never)}
      >
        <Text style={styles.buttonText}>浏览记录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '95%', alignSelf: 'center', marginBottom: 20 },
  outlinedButton: { flex: 1, marginHorizontal: 6, paddingVertical: 10, borderWidth: 1, borderColor: '#2B333E', borderRadius: 8, alignItems: 'center', backgroundColor: '#fff' },
  buttonText: { fontSize: 14, color: '#2B333E', fontWeight: '600' },
});
