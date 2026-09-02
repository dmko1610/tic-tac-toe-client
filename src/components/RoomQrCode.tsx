import QRCode from "react-native-qrcode-svg";
import { createRoomQrValue } from "../helpers/roomQr";

type Props = {
  roomCode: string;
};

export function RoomQrCode({ roomCode }: Props) {
  return <QRCode value={createRoomQrValue(roomCode)} size={120} />;
}
