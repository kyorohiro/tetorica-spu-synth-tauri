// SPDX-License-Identifier: BSD-3-Clause
// Original format fixtures for the file pickers; no recordings, games or BIOS.
const {deflateSync} = require('node:zlib');

function createVabFixture() {
  const header = Buffer.alloc(0xe20), body = Buffer.alloc(128);
  const word = (offset, value) => header.writeUInt16LE(value, offset);
  header.write('pBAV'); header.writeUInt32LE(7, 4);
  header.writeUInt32LE(header.length + body.length, 12);
  word(0x12, 2); word(0x14, 3); word(0x16, 2);
  header[0x18] = 127; header[0x19] = 64;
  for (const [program, count] of [[3, 2], [11, 1]]) {
    const at = 0x20 + program * 16;
    header[at] = count; header[at + 1] = 127; header[at + 4] = 64;
  }
  for (const [at, program, sample, center, shift] of [[0x820, 3, 1, 60, 0], [0x840, 3, 1, 60, 64], [0xa20, 11, 2, 69, 0]]) {
    header[at + 2] = 100; header[at + 3] = 64;
    header[at + 4] = center; header[at + 5] = shift;
    header[at + 6] = 24; header[at + 7] = 96;
    word(at + 16, 15); word(at + 20, program); word(at + 22, sample);
  }
  word(0xc20, 2); word(0xc22, 10); word(0xc24, 4);
  // Sample 1 is a four-packet silent loop with trailing padding.
  for (let block = 0; block < 4; block++) {
    body[16 + block * 16] = 12;
    body[17 + block * 16] = block === 0 ? 6 : block === 3 ? 3 : 0;
  }
  body[96] = 12; body[97] = 1; // Sample 2: silent one-shot plus padding.
  return {vab: Buffer.concat([header, body])};
}

function createPsfFixture() {
  const exe = Buffer.alloc(0x808);
  exe.write('PS-X EXE'); exe.writeUInt32LE(0x80010000, 0x10);
  exe.writeUInt32LE(0x80010000, 0x18); exe.writeUInt32LE(8, 0x1c);
  exe.writeUInt32LE(0x801fff00, 0x30);
  exe.writeUInt32LE(0x1000ffff, 0x800); // beq zero,zero,-1; nop (no audio).
  const compressed = deflateSync(exe), header = Buffer.alloc(16);
  let crc = 0xffffffff;
  for (const byte of compressed) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = crc >>> 1 ^ (crc & 1 ? 0xedb88320 : 0);
  }
  header.set([0x50, 0x53, 0x46, 1]);
  header.writeUInt32LE(compressed.length, 8); header.writeUInt32LE((crc ^ 0xffffffff) >>> 0, 12);
  return {psf: Buffer.concat([header, compressed, Buffer.from('[TAG]title=Tetorica original menu fixture\nlength=0:04\n')])};
}

module.exports = {createVabFixture, createPsfFixture};
