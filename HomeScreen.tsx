import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import {
  createTable,
  insertData,
  fetchData,
  deleteData,
  updateData,
} from "./database";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define navigation props type (replace RootStackParamList with your own type if you have one)
type HomeScreenNavigationProp = NativeStackNavigationProp<any, "HomeScreen">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

// Define the type for your scanned data
interface ScannedData {
  id?: number;
  imageByteArray: string;
  bodyPartName: string;
  bodyPartType: string;
  risk: string;
  assymetry: boolean;
  irregularBorders: boolean;
  variedColors: boolean;
  diameterLargerThanSix: boolean;
  selectedSkinColor: string;
  analyzed: string;
  timeStamp: number;
  isSelected: boolean;
  isFromselfExam: string | number | boolean;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [entries, setEntries] = useState<ScannedData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ScannedData>({
    imageByteArray: "",
    bodyPartName: "",
    bodyPartType: "",
    risk: "",
    assymetry: false,
    irregularBorders: false,
    variedColors: false,
    diameterLargerThanSix: false,
    selectedSkinColor: "",
    analyzed: "",
    timeStamp: Date.now(),
    isSelected: false,
    isFromselfExam: "1",
  });

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();

    createTable().then(() => console.log("Table created ✅"));
    loadData();
  }, []);

  const loadData = () => {
    fetchData((data: ScannedData[]) => {
      setEntries(data);
    });
  };

  const handleAddOrUpdate = () => {
    if (!formData.bodyPartName || !formData.risk) {
      Alert.alert("Validation", "Please fill in Body Part Name and Risk.");
      return;
    }

    if (editingId !== null) {
      updateData(editingId, formData, () => {
        loadData();
        clearForm();
        Alert.alert("Success", "Entry updated successfully ✅");
      });
    } else {
      insertData(formData, () => {
        loadData();
        clearForm();
        Alert.alert("Success", "Data added successfully ✅");
      });
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteData(id, () => {
              loadData();
              Alert.alert("Deleted", "Entry deleted successfully ❌");
            });
          },
        },
      ]
    );
  };

  const handleEdit = (item: ScannedData) => {
    setFormData({
      ...item,
      assymetry: Boolean(item.assymetry),
      irregularBorders: Boolean(item.irregularBorders),
      variedColors: Boolean(item.variedColors),
      diameterLargerThanSix: Boolean(item.diameterLargerThanSix),
      isSelected: Boolean(item.isSelected),
    });
    setEditingId(item.id ?? null);
  };

  const clearForm = () => {
    setFormData({
      imageByteArray: "",
      bodyPartName: "",
      bodyPartType: "",
      risk: "",
      assymetry: false,
      irregularBorders: false,
      variedColors: false,
      diameterLargerThanSix: false,
      selectedSkinColor: "",
      analyzed: "",
      timeStamp: Date.now(),
      isSelected: false,
      isFromselfExam: "1",
    });
    setEditingId(null);
  };

  const handleChange = (name: keyof ScannedData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBoolean = (name: keyof ScannedData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name] as boolean,
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64Image = result.assets[0].base64;
      setFormData((prev) => ({
        ...prev,
        imageByteArray: base64Image || "",
      }));
    }
  };

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>
        {editingId !== null ? "Edit Entry" : "Add Scanned Data"}
      </Text>

      <TouchableOpacity
        style={styles.imagePickerBtn}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {formData.imageByteArray ? (
          <Image
            source={{
              uri: `data:image/jpeg;base64,${formData.imageByteArray}`,
            }}
            style={styles.previewImage}
          />
        ) : (
          <Text style={styles.noImageText}>Tap to select an image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Body Part Name"
        placeholderTextColor="#999"
        value={formData.bodyPartName}
        onChangeText={(text) => handleChange("bodyPartName", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Body Part Type"
        placeholderTextColor="#999"
        value={formData.bodyPartType}
        onChangeText={(text) => handleChange("bodyPartType", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Risk"
        placeholderTextColor="#999"
        value={formData.risk}
        onChangeText={(text) => handleChange("risk", text)}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            formData.assymetry && styles.toggleButtonActive,
          ]}
          onPress={() => toggleBoolean("assymetry")}
        >
          <Text style={styles.toggleText}>
            Assymetry: {formData.assymetry ? "Yes" : "No"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            formData.irregularBorders && styles.toggleButtonActive,
          ]}
          onPress={() => toggleBoolean("irregularBorders")}
        >
          <Text style={styles.toggleText}>
            Irregular Borders: {formData.irregularBorders ? "Yes" : "No"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            formData.variedColors && styles.toggleButtonActive,
          ]}
          onPress={() => toggleBoolean("variedColors")}
        >
          <Text style={styles.toggleText}>
            Varied Colors: {formData.variedColors ? "Yes" : "No"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            formData.diameterLargerThanSix && styles.toggleButtonActive,
          ]}
          onPress={() => toggleBoolean("diameterLargerThanSix")}
        >
          <Text style={styles.toggleText}>
            Diameter &gt; 6: {formData.diameterLargerThanSix ? "Yes" : "No"}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Selected Skin Color"
        placeholderTextColor="#999"
        value={formData.selectedSkinColor}
        onChangeText={(text) => handleChange("selectedSkinColor", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Analyzed"
        placeholderTextColor="#999"
        value={formData.analyzed}
        onChangeText={(text) => handleChange("analyzed", text)}
      />

      <TouchableOpacity
        style={[
          styles.toggleButton,
          formData.isSelected && styles.toggleButtonActive,
        ]}
        onPress={() => toggleBoolean("isSelected")}
      >
        <Text style={styles.toggleText}>
          Is Selected: {formData.isSelected ? "Yes" : "No"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Is From Self Exam (1/0/true/false)"
        placeholderTextColor="#999"
        value={String(formData.isFromselfExam)}
        onChangeText={(text) => handleChange("isFromselfExam", text)}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleAddOrUpdate}
        activeOpacity={0.8}
      >
        <Text style={styles.submitBtnText}>
          {editingId !== null ? "Update Data" : "Add Data"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.showEntriesBtn}
        onPress={() => navigation.navigate("StoredEntries")}
        activeOpacity={0.8}
      >
        <Text style={styles.showEntriesBtnText}>Show Stored Entries</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {renderForm()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f7",
    padding: 15,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    fontSize: wp("4%"),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  previewImage: {
    width: "100%",
    height: hp("30%"),
    borderRadius: 10,
  },
  imagePickerBtn: {
    backgroundColor: "#e0e0e0",
    height: hp("30%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 10,
  },
  noImageText: {
    color: "#888",
    fontSize: wp("4%"),
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#4caf50",
  },
  toggleText: {
    color: "#333",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    textAlign: "center",
  },
  showEntriesBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  showEntriesBtnText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    textAlign: "center",
  },
});
