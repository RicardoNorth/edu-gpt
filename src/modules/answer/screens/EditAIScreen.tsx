import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { usePromptStore } from '../store/promptStore';
import * as ImagePicker from 'expo-image-picker';

export default function EditAIScreen() {
  const { aiName, setAiName, aiAvatar, setAiAvatar, prompt, setPrompt } = usePromptStore();
  const [newName, setNewName] = useState(aiName);
  const [newPrompt, setNewPrompt] = useState(prompt);
  const [newAvatar, setNewAvatar] = useState(aiAvatar);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatar(result.assets[0].uri);
    }
  };

  const saveChanges = () => {
    setAiName(newName);
    setPrompt(newPrompt);
    setAiAvatar(newAvatar);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>AI昵称</Text>
      <TextInput
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
        placeholder="请输入AI昵称"
      />

      <Text style={styles.label}>AI头像</Text>
      <TouchableOpacity onPress={pickImage}>
        {newAvatar ? (
          <Image source={{ uri: newAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>选择头像</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>AI人设（Prompt）</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={newPrompt}
        onChangeText={setNewPrompt}
        placeholder="请输入人设"
        multiline
      />

      <Button title="保存修改" onPress={saveChanges} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
