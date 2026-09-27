import { Box, Paper, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import ProfileAbout from "./ProfileAbout";
import ProfilePrivacy from "./ProfilePrivacy";
import ProfileLessons from "./sections/ProfileLessons";
import ProfilePuzzles from "./sections/ProfilePuzzles";
import ProfileSchedule from "./sections/ProfileSchedule";
import ProfileStatistics from "./sections/ProfileStatistics";
import ProfileStudents from "./sections/ProfileStudents";

export default function ProfileContent() {
  const [value, setValue] = useState(0);
  const { id } = useParams();
  const { profile, isCurrentUser } = useProfile(id);

  const isStudent = profile?.roles?.some(r => r.toLowerCase() === 'student');
  const isTeacher = profile?.roles?.some(r => r.toLowerCase() === 'teacher');

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabContent = [
    ...(isStudent && isCurrentUser ? [
      { label: 'График', content: <ProfileSchedule /> },
      { label: 'Статистики', content: <ProfileStatistics /> },
      { label: 'Задачи', content: <ProfilePuzzles /> },
    ] : []),
    ...(isTeacher && isCurrentUser ? [
      { label: 'Моите занятия', content: <ProfileLessons /> },
      { label: 'Моите ученици', content: <ProfileStudents /> },
    ] : []),
    { label: 'Моите данни', content: <ProfileAbout /> },
    { label: 'Поверителност', content: <ProfilePrivacy /> },
  ];

  return (
    <Box
      component={Paper}
      mt={12}
      p={3}
      elevation={3}
      sx={{ display: 'flex', alignItems: 'flex-start', borderRadius: 3, minHeight: 500 }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200 }}
      >
        {tabContent.map((tab, index) => (
          <Tab key={index} label={tab.label} sx={{ mr: 3 }} />
        ))}
      </Tabs>
      <Box sx={{ flexGrow: 1, p: 3, pt: 0 }}>
        {tabContent[value]?.content}
      </Box>
    </Box>
  );
}