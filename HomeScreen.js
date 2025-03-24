import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert, // ✅ Import Alert
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

const HomeScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [showEntries, setShowEntries] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
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

    createTable().then(() => console.log("Table created"));
    loadData();
  }, []);

  const loadData = () => {
    fetchData((data) => {
      setEntries(data);
    });
  };

  const handleAddOrUpdate = () => {
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

  const handleDelete = (id) => {
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

  const handleEdit = (item) => {
    setFormData({
      imageByteArray: item.imageByteArray,
      bodyPartName: item.bodyPartName,
      bodyPartType: item.bodyPartType,
      risk: item.risk,
      assymetry: item.assymetry === 1,
      irregularBorders: item.irregularBorders === 1,
      variedColors: item.variedColors === 1,
      diameterLargerThanSix: item.diameterLargerThanSix === 1,
      selectedSkinColor: item.selectedSkinColor,
      analyzed: item.analyzed,
      timeStamp: item.timeStamp,
      isSelected: item.isSelected === 1,
      isFromselfExam: item.isFromselfExam,
    });
    setEditingId(item.id);
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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const toggleBoolean = (name) => {
    setFormData({ ...formData, [name]: !formData[name] });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64Image = result.assets[0].base64;
      setFormData({ ...formData, imageByteArray: base64Image });
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
        value={formData.isFromselfExam.toString()}
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
        onPress={() => setShowEntries(!showEntries)}
        activeOpacity={0.8}
      >
        <Text style={styles.showEntriesBtnText}>
          {showEntries ? "Hide Stored Entries" : "Show Stored Entries"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEntryItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.entryTitle}>
          {item.bodyPartName} - Risk: {item.risk}
        </Text>

        {item.imageByteArray ? (
          <Image
            source={{
              uri: `data:image/jpeg;base64,${item.imageByteArray}`,
            }}
            style={styles.listImage}
          />
        ) : (
          <Text style={styles.noImageText}>No Image</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.actionBtn}
        >
          <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.actionBtn}
        >
          <Text style={styles.deleteBtn}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Details", { item })}
          style={styles.actionBtn}
        >
          <Text style={styles.detailsBtn}>Show Details</Text>
        </TouchableOpacity>
      </View>
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

      {showEntries && (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEntryItem}
          contentContainerStyle={styles.flatListContainer}
          ListHeaderComponent={
            <Text style={styles.listTitle}>Stored Entries</Text>
          }
        />
      )}
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
  listTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  listImage: {
    width: wp("20%"),
    height: hp("10%"),
    borderRadius: 8,
    marginTop: 5,
  },
  entryTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#333",
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  actionBtn: {
    marginVertical: 2,
  },
  editBtn: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  deleteBtn: {
    color: "#F44336",
    fontWeight: "bold",
  },
  detailsBtn: {
    color: "#4caf50",
    fontWeight: "bold",
  },
});
