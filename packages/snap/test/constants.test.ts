import { type JsonBIP44CoinTypeNode } from '@metamask/key-tree';

export const bip44Entropy: JsonBIP44CoinTypeNode = {
  depth: 2,
  masterFingerprint: 256603435,
  parentFingerprint: 2313713264,
  index: 2147484536,
  privateKey:
    '0x0996f6115b7e6eb1f98da5e260f0834f556815b9e1447a2a0f5a6b671c4c274e',
  publicKey:
    '0x043bc3126aa2109c76519c33d56016ae2ffa85b795aef932d453fe58e1b5b0383adb55501b2e30200eff71893610de3225811f45e598e694049689ae4e9150b616',
  chainCode:
    '0xf670e976db9b54486dd667abaacdb7a0ec46e0cb176f878b80d88bc787074dd3',
  coin_type: 888,
  path: "m / bip32:44' / bip32:888'",
};

test.skip('skip', () => {});