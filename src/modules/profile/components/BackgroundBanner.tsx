import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '../store';

const screenHeight = Dimensions.get('window').height;

export default function BackgroundBanner() {
  const { user, setBackground } = useProfileStore();

  const pickBackground = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('权限不足', '需要访问媒体库权限才能上传背景');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setBackground(result.assets[0].uri); 
    }
  };

  return (
    <TouchableOpacity onPress={pickBackground}>
      <ImageBackground
        source={
          user.background
            ? { uri: user.background }
            : require('../../../../assets/default-bg.jpg')
        }
        style={styles.banner}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: screenHeight * 0.22,
  },
});
