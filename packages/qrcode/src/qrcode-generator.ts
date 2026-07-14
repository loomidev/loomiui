export type LoomiQrErrorCorrection = "L" | "M" | "Q" | "H";

export interface LoomiQrMatrix {
  modules: boolean[][];
  size: number;
  version: number;
}

interface RsBlock {
  totalCodewords: number;
  dataCodewords: number;
}

const MAX_VERSION = 10;
const TOTAL_CODEWORDS = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346];
const ALIGNMENT_CENTERS: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const RS_BLOCKS: Record<LoomiQrErrorCorrection, number[][]> = {
  L: [
    [],
    [1, 26, 19],
    [1, 44, 34],
    [1, 70, 55],
    [1, 100, 80],
    [1, 134, 108],
    [2, 86, 68],
    [2, 98, 78],
    [2, 121, 97],
    [2, 146, 116],
    [2, 86, 68, 2, 87, 69],
  ],
  M: [
    [],
    [1, 26, 16],
    [1, 44, 28],
    [1, 70, 44],
    [2, 50, 32],
    [2, 67, 43],
    [4, 43, 27],
    [4, 49, 31],
    [2, 60, 38, 2, 61, 39],
    [3, 58, 36, 2, 59, 37],
    [4, 69, 43, 1, 70, 44],
  ],
  Q: [
    [],
    [1, 26, 13],
    [1, 44, 22],
    [2, 35, 17],
    [2, 50, 24],
    [2, 33, 15, 2, 34, 16],
    [4, 43, 19],
    [2, 32, 14, 4, 33, 15],
    [4, 40, 18, 2, 41, 19],
    [4, 36, 16, 4, 37, 17],
    [6, 43, 19, 2, 44, 20],
  ],
  H: [
    [],
    [1, 26, 9],
    [1, 44, 16],
    [2, 35, 13],
    [4, 25, 9],
    [2, 33, 11, 2, 34, 12],
    [4, 43, 15],
    [4, 39, 13, 1, 40, 14],
    [4, 40, 14, 2, 41, 15],
    [4, 36, 12, 4, 37, 13],
    [6, 43, 15, 2, 44, 16],
  ],
};

const FORMAT_ECC_BITS: Record<LoomiQrErrorCorrection, number> = { M: 0, L: 1, H: 2, Q: 3 };
const G15 = 0x537;
const G18 = 0x1f25;
const G15_MASK = 0x5412;

const EXP_TABLE = new Array<number>(512).fill(0);
const LOG_TABLE = new Array<number>(256).fill(0);
let x = 1;
for (let i = 0; i < 255; i += 1) {
  EXP_TABLE[i] = x;
  LOG_TABLE[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= 0x11d;
}
for (let i = 255; i < EXP_TABLE.length; i += 1) EXP_TABLE[i] = EXP_TABLE[i - 255];

class BitBuffer {
  readonly bits: number[] = [];

  append(value: number, length: number): void {
    for (let i = length - 1; i >= 0; i -= 1) {
      this.bits.push((value >>> i) & 1);
    }
  }
}

export function generateQrCode(
  value: string,
  errorCorrection: LoomiQrErrorCorrection = "M",
): LoomiQrMatrix {
  const bytes = Array.from(new TextEncoder().encode(value));
  const normalizedErrorCorrection = normalizeErrorCorrection(errorCorrection);
  const version = chooseVersion(bytes.length, normalizedErrorCorrection);
  const dataCodewords = createDataCodewords(bytes, version, normalizedErrorCorrection);
  const codewords = addErrorCorrection(dataCodewords, version, normalizedErrorCorrection);
  return createMatrix(codewords, version, normalizedErrorCorrection);
}

function normalizeErrorCorrection(value: LoomiQrErrorCorrection): LoomiQrErrorCorrection {
  return value === "L" || value === "Q" || value === "H" ? value : "M";
}

function chooseVersion(byteLength: number, errorCorrection: LoomiQrErrorCorrection): number {
  for (let version = 1; version <= MAX_VERSION; version += 1) {
    const dataCodewords = getRsBlocks(version, errorCorrection).reduce(
      (total, block) => total + block.dataCodewords,
      0,
    );
    const countBits = version < 10 ? 8 : 16;
    const requiredBits = 4 + countBits + byteLength * 8;
    if (requiredBits <= dataCodewords * 8) return version;
  }

  throw new Error(`QR value is too long for supported QR versions 1-${MAX_VERSION}.`);
}

function createDataCodewords(
  bytes: number[],
  version: number,
  errorCorrection: LoomiQrErrorCorrection,
): number[] {
  const blocks = getRsBlocks(version, errorCorrection);
  const capacity = blocks.reduce((total, block) => total + block.dataCodewords, 0);
  const buffer = new BitBuffer();

  buffer.append(0b0100, 4);
  buffer.append(bytes.length, version < 10 ? 8 : 16);
  for (const byte of bytes) buffer.append(byte, 8);

  const capacityBits = capacity * 8;
  const terminatorLength = Math.min(4, capacityBits - buffer.bits.length);
  buffer.append(0, terminatorLength);
  while (buffer.bits.length % 8 !== 0) buffer.append(0, 1);

  const codewords: number[] = [];
  for (let i = 0; i < buffer.bits.length; i += 8) {
    let codeword = 0;
    for (let j = 0; j < 8; j += 1) codeword = (codeword << 1) | buffer.bits[i + j];
    codewords.push(codeword);
  }

  for (let pad = 0xec; codewords.length < capacity; pad = pad === 0xec ? 0x11 : 0xec) {
    codewords.push(pad);
  }

  return codewords;
}

function addErrorCorrection(
  dataCodewords: number[],
  version: number,
  errorCorrection: LoomiQrErrorCorrection,
): number[] {
  const blocks = getRsBlocks(version, errorCorrection);
  const dataBlocks: number[][] = [];
  const eccBlocks: number[][] = [];
  let offset = 0;

  for (const block of blocks) {
    const data = dataCodewords.slice(offset, offset + block.dataCodewords);
    offset += block.dataCodewords;
    dataBlocks.push(data);
    eccBlocks.push(
      createErrorCorrectionCodewords(data, block.totalCodewords - block.dataCodewords),
    );
  }

  const result: number[] = [];
  const maxDataLength = Math.max(...dataBlocks.map((block) => block.length));
  const maxEccLength = Math.max(...eccBlocks.map((block) => block.length));

  for (let i = 0; i < maxDataLength; i += 1) {
    for (const block of dataBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }
  for (let i = 0; i < maxEccLength; i += 1) {
    for (const block of eccBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }

  return result.slice(0, TOTAL_CODEWORDS[version]);
}

function getRsBlocks(version: number, errorCorrection: LoomiQrErrorCorrection): RsBlock[] {
  const row = RS_BLOCKS[errorCorrection][version];
  const blocks: RsBlock[] = [];
  for (let i = 0; i < row.length; i += 3) {
    const count = row[i];
    for (let j = 0; j < count; j += 1) {
      blocks.push({ totalCodewords: row[i + 1], dataCodewords: row[i + 2] });
    }
  }
  return blocks;
}

function createErrorCorrectionCodewords(data: number[], degree: number): number[] {
  const generator = createGeneratorPolynomial(degree);
  const result = new Array<number>(degree).fill(0);

  for (const byte of data) {
    const factor = byte ^ result[0];
    result.shift();
    result.push(0);
    for (let i = 0; i < degree; i += 1) {
      result[i] ^= gfMultiply(generator[i + 1], factor);
    }
  }

  return result;
}

function createGeneratorPolynomial(degree: number): number[] {
  let result = [1];
  for (let i = 0; i < degree; i += 1) {
    result = multiplyPolynomials(result, [1, EXP_TABLE[i]]);
  }
  return result;
}

function multiplyPolynomials(left: number[], right: number[]): number[] {
  const result = new Array<number>(left.length + right.length - 1).fill(0);
  for (let i = 0; i < left.length; i += 1) {
    for (let j = 0; j < right.length; j += 1) {
      result[i + j] ^= gfMultiply(left[i], right[j]);
    }
  }
  return result;
}

function gfMultiply(left: number, right: number): number {
  if (left === 0 || right === 0) return 0;
  return EXP_TABLE[LOG_TABLE[left] + LOG_TABLE[right]];
}

function createMatrix(
  codewords: number[],
  version: number,
  errorCorrection: LoomiQrErrorCorrection,
): LoomiQrMatrix {
  const size = version * 4 + 17;
  const base = createBaseMatrix(version);
  const dataBits = codewords.flatMap((codeword) => {
    const bits: number[] = [];
    for (let i = 7; i >= 0; i -= 1) bits.push((codeword >>> i) & 1);
    return bits;
  });

  let bestModules: boolean[][] | null = null;
  let bestPenalty = Number.POSITIVE_INFINITY;

  for (let mask = 0; mask < 8; mask += 1) {
    const modules = base.modules.map((row) => row.slice());
    placeDataBits(modules, base.reserved, dataBits, mask);
    placeFormatInfo(modules, errorCorrection, mask);
    if (version >= 7) placeVersionInfo(modules, version);
    const penalty = calculatePenalty(modules);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestModules = modules;
    }
  }

  return { modules: bestModules ?? base.modules, size, version };
}

function createBaseMatrix(version: number): { modules: boolean[][]; reserved: boolean[][] } {
  const size = version * 4 + 17;
  const modules = create2d(size, false);
  const reserved = create2d(size, false);

  addFinderPattern(modules, reserved, 0, 0);
  addFinderPattern(modules, reserved, size - 7, 0);
  addFinderPattern(modules, reserved, 0, size - 7);
  addTimingPatterns(modules, reserved);
  addAlignmentPatterns(modules, reserved, version);
  reserveFormatAreas(reserved);
  if (version >= 7) reserveVersionInfoAreas(reserved);
  setModule(modules, reserved, 8, size - 8, true);

  return { modules, reserved };
}

function create2d(size: number, value: boolean): boolean[][] {
  return Array.from({ length: size }, () => new Array<boolean>(size).fill(value));
}

function setModule(
  modules: boolean[][],
  reserved: boolean[][],
  x: number,
  y: number,
  value: boolean,
): void {
  if (y < 0 || y >= modules.length || x < 0 || x >= modules.length) return;
  modules[y][x] = value;
  reserved[y][x] = true;
}

function addFinderPattern(modules: boolean[][], reserved: boolean[][], x: number, y: number): void {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (yy < 0 || yy >= modules.length || xx < 0 || xx >= modules.length) continue;
      const inPattern = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
      const dark =
        inPattern &&
        (dx === 0 ||
          dx === 6 ||
          dy === 0 ||
          dy === 6 ||
          (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      setModule(modules, reserved, xx, yy, dark);
    }
  }
}

function addTimingPatterns(modules: boolean[][], reserved: boolean[][]): void {
  const size = modules.length;
  for (let i = 8; i < size - 8; i += 1) {
    const dark = i % 2 === 0;
    setModule(modules, reserved, i, 6, dark);
    setModule(modules, reserved, 6, i, dark);
  }
}

function addAlignmentPatterns(modules: boolean[][], reserved: boolean[][], version: number): void {
  for (const y of ALIGNMENT_CENTERS[version]) {
    for (const x of ALIGNMENT_CENTERS[version]) {
      if (reserved[y][x]) continue;
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const distance = Math.max(Math.abs(dx), Math.abs(dy));
          setModule(modules, reserved, x + dx, y + dy, distance === 2 || distance === 0);
        }
      }
    }
  }
}

function reserveFormatAreas(reserved: boolean[][]): void {
  const size = reserved.length;
  for (let i = 0; i <= 8; i += 1) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }
  for (let i = 0; i < 8; i += 1) reserved[8][size - 1 - i] = true;
  for (let i = 0; i < 7; i += 1) reserved[size - 1 - i][8] = true;
}

function reserveVersionInfoAreas(reserved: boolean[][]): void {
  const size = reserved.length;
  for (let i = 0; i < 18; i += 1) {
    reserved[Math.floor(i / 3)][(i % 3) + size - 11] = true;
    reserved[(i % 3) + size - 11][Math.floor(i / 3)] = true;
  }
}

function placeDataBits(
  modules: boolean[][],
  reserved: boolean[][],
  bits: number[],
  mask: number,
): void {
  const size = modules.length;
  let bitIndex = 0;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let vertical = 0; vertical < size; vertical += 1) {
      const y = upward ? size - 1 - vertical : vertical;
      for (let column = 0; column < 2; column += 1) {
        const x = right - column;
        if (reserved[y][x]) continue;
        const bit = bitIndex < bits.length ? bits[bitIndex] === 1 : false;
        modules[y][x] = bit !== maskApplies(mask, x, y);
        bitIndex += 1;
      }
    }
    upward = !upward;
  }
}

function maskApplies(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    case 7:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return false;
  }
}

function placeFormatInfo(
  modules: boolean[][],
  errorCorrection: LoomiQrErrorCorrection,
  mask: number,
): void {
  const size = modules.length;
  const bits = calculateBchTypeInfo((FORMAT_ECC_BITS[errorCorrection] << 3) | mask);

  for (let i = 0; i < 15; i += 1) {
    const dark = ((bits >>> i) & 1) === 1;

    if (i < 6) modules[i][8] = dark;
    else if (i < 8) modules[i + 1][8] = dark;
    else modules[size - 15 + i][8] = dark;

    if (i < 8) modules[8][size - i - 1] = dark;
    else if (i < 9) modules[8][15 - i] = dark;
    else modules[8][14 - i] = dark;
  }

  modules[size - 8][8] = true;
}

function placeVersionInfo(modules: boolean[][], version: number): void {
  const size = modules.length;
  const bits = calculateBchVersionInfo(version);

  for (let i = 0; i < 18; i += 1) {
    const dark = ((bits >>> i) & 1) === 1;
    modules[Math.floor(i / 3)][(i % 3) + size - 11] = dark;
    modules[(i % 3) + size - 11][Math.floor(i / 3)] = dark;
  }
}

function calculateBchTypeInfo(data: number): number {
  let d = data << 10;
  while (bchDigit(d) - bchDigit(G15) >= 0) d ^= G15 << (bchDigit(d) - bchDigit(G15));
  return ((data << 10) | d) ^ G15_MASK;
}

function calculateBchVersionInfo(version: number): number {
  let d = version << 12;
  while (bchDigit(d) - bchDigit(G18) >= 0) d ^= G18 << (bchDigit(d) - bchDigit(G18));
  return (version << 12) | d;
}

function bchDigit(data: number): number {
  let digit = 0;
  while (data !== 0) {
    digit += 1;
    data >>>= 1;
  }
  return digit;
}

function calculatePenalty(modules: boolean[][]): number {
  return (
    penaltyRuns(modules) +
    penaltyBlocks(modules) +
    penaltyPatterns(modules) +
    penaltyBalance(modules)
  );
}

function penaltyRuns(modules: boolean[][]): number {
  const size = modules.length;
  let penalty = 0;

  for (let y = 0; y < size; y += 1) {
    penalty += linePenalty(modules[y]);
  }

  for (let x = 0; x < size; x += 1) {
    const column: boolean[] = [];
    for (let y = 0; y < size; y += 1) column.push(modules[y][x]);
    penalty += linePenalty(column);
  }

  return penalty;
}

function linePenalty(line: boolean[]): number {
  let penalty = 0;
  let runColor = line[0];
  let runLength = 1;

  for (let i = 1; i < line.length; i += 1) {
    if (line[i] === runColor) {
      runLength += 1;
    } else {
      if (runLength >= 5) penalty += 3 + runLength - 5;
      runColor = line[i];
      runLength = 1;
    }
  }
  if (runLength >= 5) penalty += 3 + runLength - 5;
  return penalty;
}

function penaltyBlocks(modules: boolean[][]): number {
  let penalty = 0;
  for (let y = 0; y < modules.length - 1; y += 1) {
    for (let x = 0; x < modules.length - 1; x += 1) {
      const color = modules[y][x];
      if (
        color === modules[y][x + 1] &&
        color === modules[y + 1][x] &&
        color === modules[y + 1][x + 1]
      ) {
        penalty += 3;
      }
    }
  }
  return penalty;
}

function penaltyPatterns(modules: boolean[][]): number {
  const pattern = [true, false, true, true, true, false, true, false, false, false, false];
  const reverse = [...pattern].reverse();
  let penalty = 0;

  for (const row of modules) {
    penalty += finderLikePatternPenalty(row, pattern, reverse);
  }

  for (let x = 0; x < modules.length; x += 1) {
    const column: boolean[] = [];
    for (let y = 0; y < modules.length; y += 1) column.push(modules[y][x]);
    penalty += finderLikePatternPenalty(column, pattern, reverse);
  }

  return penalty;
}

function finderLikePatternPenalty(line: boolean[], pattern: boolean[], reverse: boolean[]): number {
  let penalty = 0;
  for (let i = 0; i <= line.length - pattern.length; i += 1) {
    const slice = line.slice(i, i + pattern.length);
    if (matchesPattern(slice, pattern) || matchesPattern(slice, reverse)) penalty += 40;
  }
  return penalty;
}

function matchesPattern(line: boolean[], pattern: boolean[]): boolean {
  return pattern.every((value, index) => line[index] === value);
}

function penaltyBalance(modules: boolean[][]): number {
  const size = modules.length;
  const total = size * size;
  const dark = modules.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
  return Math.floor(Math.abs((dark * 100) / total - 50) / 5) * 10;
}
