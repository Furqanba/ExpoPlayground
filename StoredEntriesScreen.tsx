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
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// ✅ Replace with your actual database methods
import { fetchData, deleteData } from "./database";

// ✅ Define navigation routes
type RootStackParamList = {
  Home: { item: EntryItem };
  Details: { item: EntryItem };
  StoredEntries: undefined;
};

// ✅ Props type for screen component
type StoredEntriesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "StoredEntries">;
  route: RouteProp<RootStackParamList, "StoredEntries">;
};

// ✅ Define interface for your entries
interface EntryItem {
  id: number;
  bodyPartName: string;
  risk: string;
  imageByteArray?: string;
  timeStamp: string;
  // Add any other fields if you have
}

const StoredEntriesScreen: React.FC<StoredEntriesScreenProps> = ({
  navigation,
}) => {
  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<EntryItem[]>([]);
  const [filterOption, setFilterOption] = useState<"latest" | "oldest">(
    "latest"
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadEntries();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterEntries(entries, filterOption);
  }, [filterOption, entries]);

  const loadEntries = () => {
    fetchData((data: EntryItem[]) => {
      setEntries(data);
    });
  };

  const filterEntries = (data: EntryItem[], option: "latest" | "oldest") => {
    let sortedData = [...data];

    if (option === "latest") {
      sortedData.sort(
        (a, b) =>
          new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
      );
    } else if (option === "oldest") {
      sortedData.sort(
        (a, b) =>
          new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
      );
    }

    setFilteredEntries(sortedData);
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
              loadEntries();
              Alert.alert("Deleted", "Entry deleted successfully ❌");
            });
          },
        },
      ]
    );
  };

  const renderEntryItem = ({ item }: { item: EntryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.entryTitle}>{item.bodyPartName}</Text>
          <Text style={styles.riskLevel}>Risk: {item.risk}</Text>

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

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home", { item })}
            style={[styles.button, styles.editButton]}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={[styles.button, styles.deleteButton]}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { item })}
            style={[styles.button, styles.detailsButton]}
          >
            <Text style={styles.buttonText}>Show Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Stored Entries</Text>

      {/* Filter Menu */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterOption === "latest" && styles.activeFilter,
          ]}
          onPress={() => setFilterOption("latest")}
        >
          <Text
            style={[
              styles.filterText,
              filterOption === "latest" && styles.activeFilterText,
            ]}
          >
            Latest
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterOption === "oldest" && styles.activeFilter,
          ]}
          onPress={() => setFilterOption("oldest")}
        >
          <Text
            style={[
              styles.filterText,
              filterOption === "oldest" && styles.activeFilterText,
            ]}
          >
            Oldest
          </Text>
        </TouchableOpacity>
      </View>

      {filteredEntries.length === 0 ? (
        <Text style={styles.noEntries}>No stored entries found.</Text>
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEntryItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default StoredEntriesScreen;

// ✅ Styles remain the same (no changes required)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafa",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
  },
  noEntries: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
    marginTop: 50,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#b7c4bc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 2,
  },
  rightSection: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  riskLevel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginTop: 8,
  },
  noImageText: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
    width: 100,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  detailsButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
