import { readFile } from "fs/promises";
import { blue, green, pretty } from "../../../log.js";
const parse = async () => {
  const hexString = (
    await readFile(new URL("input.txt", import.meta.url))
  ).toString();
  return hexString.split("").map(hexToBin).join("");
};

const hexToBin = (hex) => parseInt(hex, 16).toString(2).padStart(4, 0);
const binToDec = (bin) => parseInt(bin, 2);

const createReader = (binString) => {
  let cursor = 0;
  const advance = () => {
    ++cursor;
  };

  const getBinSection = (length, raw = false) => {
    let end = cursor + length;
    const buff = [];
    while (cursor < end) {
      buff.push(binString[cursor]);
      advance();
    }
    const bin = buff.join("");
    return raw ? bin : binToDec(bin);
  };
  const readTypeFourPayload = () => {
    let bits = [];
    let s;
    while (true) {
      s = getBinSection(5, true);
      bits.push(s.substring(1));
      if (s[0] === "0") break;
    }
    return binToDec(bits.join(""));
  };

  const readOperatorPayload = () => {
    const lengthType = getBinSection(1, true) === "1" ? 11 : 15;
    const packets = [];
    const delimitter = getBinSection(lengthType);
    switch (lengthType) {
      case 15:
        const startCursor = cursor;
        while (cursor < startCursor + delimitter) packets.push(read());
        break;
      default:
        let i = 0;
        while (i++ < delimitter) {
          packets.push(read());
        }
        break;
    }
    return packets;
  };
  const read = () => {
    const [version, type] = [3, 3].map((length) => getBinSection(length));
    const packet = {
      version,
      type,
      value: null,
    };
    packet.value = type === 4 ? readTypeFourPayload() : readOperatorPayload();
    return packet;
  };
  const getVersion = () => {};
  return {
    read,
  };
};

// dfs
const sumVersions = (packet) => {
  const subtreeSum =
    packet.type === 4
      ? 0
      : packet.value.reduce((acc, packet) => acc + sumVersions(packet), 0);
  return packet.version + subtreeSum;
};

const operate = (packet) => {
  if (packet.type === 4) return packet.value;
  switch (packet.type) {
    case 0:
      return packet.value.reduce((acc, packet) => acc + operate(packet), 0);
    case 1:
      return packet.value.reduce((acc, packet) => acc * operate(packet), 1);
    case 2:
      return Math.min(...packet.value.map(operate));
    case 3:
      return Math.max(...packet.value.map(operate));
    case 5:
      return operate(packet.value[0]) > operate(packet.value[1]) ? 1 : 0;
    case 6:
      return operate(packet.value[0]) < operate(packet.value[1]) ? 1 : 0;
    case 7:
      return operate(packet.value[0]) == operate(packet.value[1]) ? 1 : 0;
    default:
      throw new Error("This should be unreachable");
  }
};
const createPacketTree = async () => {
  const bin = await parse();
  const reader = createReader(bin);
  return reader.read();
};
const part1 = async () => sumVersions(await createPacketTree());
const part2 = async () => operate(await createPacketTree());

pretty(await part2());
