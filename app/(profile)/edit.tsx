import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to change your profile picture"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsUploadingImage(true);
      try {
        await user?.setProfileImage({ file: result.assets[0].uri });
        Alert.alert("Success", "Profile picture updated!");
      } catch (error) {
        Alert.alert("Error", "Failed to update profile picture");
        console.error(error);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pb-5 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold flex-1">
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary rounded-full px-5 py-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#121212" />
          ) : (
            <Text className="text-background font-bold text-base">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="items-center mb-8 mt-4">
          <View className="relative">
            <Image
              source={user?.imageUrl || "https://via.placeholder.com/120"}
              className="bg-surface"
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
            <TouchableOpacity
              onPress={handleImagePick}
              className="absolute bottom-0 right-0 bg-primary rounded-full p-3 border-4 border-background"
              activeOpacity={0.7}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Ionicons name="camera" size={20} color="#121212" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-text-secondary text-sm mt-3">
            Tap to change profile picture
          </Text>
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-text-secondary text-sm font-semibold mb-2 ml-1">
              Your Name{" "}
              <Text className="text-red-500">*</Text>
            </Text>
            <View className="bg-surface rounded-2xl px-5 py-4 border-2 border-primary/30">
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#666"
                className="text-text-primary text-base"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-text-secondary text-sm font-semibold mb-2 ml-1">
              Last Name{" "}
              <Text className="text-red-500">*</Text>
            </Text>
            <View className="bg-surface rounded-2xl px-5 py-4 border-2 border-primary/30">
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#666"
                className="text-text-primary text-base"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-text-secondary text-sm font-semibold mb-2 ml-1">
              Email
            </Text>
            <View className="bg-surface/50 rounded-2xl px-5 py-4 border-2 border-transparent">
              <Text className="text-text-secondary text-base">
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
            </View>
            <Text className="text-text-secondary text-xs mt-1 ml-1">
              Email cannot be changed
            </Text>
          </View>
        </View>

        <View className="mt-8 bg-primary/10 rounded-2xl p-4 flex-row">
          <Ionicons name="information-circle" size={20} color="#1DB954" />
          <Text className="text-text-secondary text-sm ml-3 flex-1">
            Changes to your profile will be reflected across all your devices and
            sessions.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-surface rounded-2xl p-4 items-center"
          activeOpacity={0.7}
        >
          <Text className="text-text-secondary font-semibold text-base">
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
