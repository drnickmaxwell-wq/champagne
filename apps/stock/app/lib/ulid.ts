const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const encodeTime = (time: number) => {
  let value = time;
  let output = "";

  for (let index = 0; index < 10; index += 1) {
    output = CROCKFORD[value % 32] + output;
    value = Math.floor(value / 32);
  }

  return output;
};

const encodeRandom = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let random = 0n;
  for (const byte of bytes) {
    random = (random << 8n) | BigInt(byte);
  }

  let output = "";
  for (let index = 0; index < 16; index += 1) {
    output = CROCKFORD[Number(random % 32n)] + output;
    random /= 32n;
  }

  return output;
};

export const createUlid = () => `${encodeTime(Date.now())}${encodeRandom()}`;
