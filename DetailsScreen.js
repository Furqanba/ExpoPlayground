import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const DetailsScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scanned Data Details</Text>

      <View style={styles.card}>
        {item.imageByteArray ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.imageByteArray}` }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.noImageText}>No Image Available</Text>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <DetailRow label="Body Part Name" value={item.bodyPartName} />
        <DetailRow label="Body Part Type" value={item.bodyPartType} />
        <DetailRow label="Risk" value={item.risk} />
        <DetailRow
          label="Assymetry"
          value={item.assymetry === 1 ? "Yes" : "No"}
        />
        <DetailRow
          label="Irregular Borders"
          value={item.irregularBorders === 1 ? "Yes" : "No"}
        />
        <DetailRow
          label="Varied Colors"
          value={item.variedColors === 1 ? "Yes" : "No"}
        />
        <DetailRow
          label="Diameter > 6mm"
          value={item.diameterLargerThanSix === 1 ? "Yes" : "No"}
        />
        <DetailRow label="Selected Skin Color" value={item.selectedSkinColor} />
        <DetailRow label="Analyzed" value={item.analyzed} />
        <DetailRow
          label="Time Stamp"
          value={new Date(item.timeStamp).toLocaleString()}
        />
        <DetailRow
          label="Is Selected"
          value={item.isSelected === 1 ? "Yes" : "No"}
        />
        <DetailRow label="Is From Self Exam" value={item.isFromselfExam} />
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: wp("5%"),
    backgroundColor: "#f0f4f8", // light background for contrast
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    elevation: 4, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp("2%"),
    marginBottom: hp("2%"),
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: hp("30%"),
  },
  noImageText: {
    textAlign: "center",
    padding: hp("5%"),
    color: "#888",
    fontStyle: "italic",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp("2%"),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1.5%"),
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: hp("1%"),
  },
  label: {
    fontSize: wp("4%"),
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: wp("4%"),
    color: "#333",
  },
});
