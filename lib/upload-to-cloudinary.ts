export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadFileToCloudinaryFromBrowser(
  file: File,
): Promise<CloudinaryUploadResult> {
  const res = await fetch("/api/cloudinary", { method: "POST" });
  if (!res.ok) throw new Error("Failed to get upload signature");

  const { signature, timestamp, cloudName, apiKey, folder } = await res.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData },
  );

  if (!uploadRes.ok) {
    const errBody = await uploadRes.text();
    throw new Error(`Upload failed: ${errBody}`);
  }

  const result = await uploadRes.json();
  return { secure_url: result.secure_url, public_id: result.public_id };
}
