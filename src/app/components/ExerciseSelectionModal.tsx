import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useWorkoutStore } from "store/workout-store";

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ExerciseSelectionModal({
  visible,
  onClose,
}: ExerciseSelectionModalProps) {
  const router = useRouter();
  const { addExerciseToWorkout } = useWorkoutStore();
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  return (
    <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}>
        <Text>Ejercicio</Text>
    </Modal>
  );
}
