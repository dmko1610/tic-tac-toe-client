import { CameraView, useCameraPermissions } from "expo-camera";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { parseRoomQrValue } from "../helpers/roomQr";

type Props = {
  onRoomScanned: (roomCode: string) => void;
  onCancel: () => void;
};

export function ScanRoomScreen({ onRoomScanned, onCancel }: Props) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.statusText}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Camera permission</Text>
        <Text style={styles.description}>
          Camera access is needed to scan room QR codes
        </Text>
        <Pressable style={styles.actionButton} onPress={requestPermission}>
          <Text style={styles.actionButtonText}>Allow camera</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => {
          const roomCode = parseRoomQrValue(data);

          if (roomCode) {
            onRoomScanned(roomCode);
          }
        }}
      />
      <View style={styles.overlay}>
        <Text style={styles.scanTitle}>Scan room QR</Text>

        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <Text style={styles.scanHint}>
          Point your camera at the host's room code
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.actionButton} onPress={onCancel}>
          <Text style={styles.actionButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const FRAME_SIZE = 300;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#fff"
  },
  wrapper: { flex: 1, backgroundColor: "#000" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  description: { width: 300, fontSize: 16, textAlign: "center", color: "#555" },
  statusText: { fontSize: 16, color: "#555" },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 24
  },
  scanTitle: { color: "#fff", fontSize: 28, fontWeight: "800" },
  scanHint: { width: 300, color: "#fff", fontSize: 16, textAlign: "center" },
  scanFrame: { width: FRAME_SIZE, height: FRAME_SIZE },
  corner: { position: "absolute", width: 44, height: 44, borderColor: "#fff" },
  topLeft: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5 },
  topRight: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5 },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 5,
    borderBottomWidth: 5
  },
  footer: { alignItems: "center", padding: 24, paddingBottom: 40 },
  actionButton: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#222"
  },
  actionButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  secondaryButtonText: { color: "#222", fontSize: 16, fontWeight: "700" }
});
