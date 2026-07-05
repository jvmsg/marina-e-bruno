export interface PixConfig {
  key: string;
  merchantName: string;
  merchantCity: string;
}

function normalizeMerchantName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .slice(0, 25);
}

function normalizeMerchantCity(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, 15);
}

export function getPixConfig(): PixConfig {
  const key = process.env.PIX_KEY?.trim();
  const merchantName = process.env.PIX_MERCHANT_NAME?.trim();
  const merchantCity = process.env.PIX_MERCHANT_CITY?.trim();

  if (!key || !merchantName || !merchantCity) {
    throw new Error(
      "Pix não configurado. Defina PIX_KEY, PIX_MERCHANT_NAME e PIX_MERCHANT_CITY.",
    );
  }

  return {
    key,
    merchantName: normalizeMerchantName(merchantName),
    merchantCity: normalizeMerchantCity(merchantCity),
  };
}

export function orderIdToTxid(orderId: string): string {
  return orderId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25).toUpperCase();
}

function emv(id: string, value: string): string {
  if (value.length > 99) {
    throw new Error(`Campo Pix ${id} excede 99 caracteres.`);
  }

  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

function crc16CcittFalse(payload: string): string {
  let crc = 0xffff;

  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildPixPayload(
  config: PixConfig,
  amountCents: number,
  transactionId: string,
): string {
  const amount = (amountCents / 100).toFixed(2);
  const gui = emv("00", "BR.GOV.BCB.PIX");
  const pixKey = emv("01", config.key);
  const merchantAccountInformation = emv("26", `${gui}${pixKey}`);
  const additionalData = emv("05", transactionId);

  const payloadWithoutCrc = [
    emv("00", "01"),
    emv("01", "12"),
    merchantAccountInformation,
    emv("52", "0000"),
    emv("53", "986"),
    emv("54", amount),
    emv("58", "BR"),
    emv("59", config.merchantName),
    emv("60", config.merchantCity),
    emv("62", additionalData),
  ].join("");

  const crc = crc16CcittFalse(`${payloadWithoutCrc}6304`);
  return `${payloadWithoutCrc}6304${crc}`;
}

export function createPixCopyPasteCode(
  orderId: string,
  amountCents: number,
  config: PixConfig = getPixConfig(),
): string {
  if (amountCents <= 0) {
    throw new Error("Valor Pix inválido.");
  }

  const transactionId = orderIdToTxid(orderId);

  if (!transactionId) {
    throw new Error("Identificador Pix inválido.");
  }

  return buildPixPayload(config, amountCents, transactionId);
}
