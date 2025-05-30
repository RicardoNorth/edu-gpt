import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BackgroundBanner from '../components/BackgroundBanner';
import AvatarCard from '../components/AvatarCard';
import EditAndSearchButtons from '../components/EditAndSearchButtons';
import ScheduleTable from '../components/ScheduleTable';
import scheduleData from '../mock/scheduleData.json';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <BackgroundBanner />
      <AvatarCard />
      <EditAndSearchButtons />
      <ScheduleTable data={scheduleData.data} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
});
