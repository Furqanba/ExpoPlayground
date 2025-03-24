import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { fetchData, deleteData } from "./database";

const StoredEntriesScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadEntries();
    });

    return unsubscribe;
  }, [navigation]);

  const loadEntries = () => {
    fetchData((data) => {
      setEntries(data);
    });
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
              loadEntries();
              Alert.alert("Deleted", "Entry deleted successfully ❌");
            });
          },
        },
      ]
    );
  };

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
          onPress={() => navigation.navigate("Home", { item })}
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
    <View style={styles.container}>
      <Text style={styles.header}>Stored Entries</Text>
      {entries.length === 0 ? (
        <Text style={styles.noEntries}>No stored entries found.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEntryItem}
        />
      )}
    </View>
  );
};

export default StoredEntriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  noEntries: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
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
    width: 80,
    height: 80,
    borderRadius: 8,
    marginTop: 5,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  noImageText: {
    color: "#888",
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
