import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BackgroundBanner from '../components/BackgroundBanner';
import AvatarCard from '../components/AvatarCard';
import EditAndSearchButtons from '../components/EditAndSearchButtons';
import RecommendedUserList from '../components/RecommendedUserList';
import DurationChart from '../components/DurationChart';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackgroundBanner />
      <AvatarCard />
      <EditAndSearchButtons />
      <DurationChart />
      <RecommendedUserList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
});
