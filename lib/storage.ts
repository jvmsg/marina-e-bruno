const BUCKET = "wedding-photos";

export function getStoragePublicUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl || !path) {
    return "";
  }

  const cleanPath = path.replace(/^\/+/, "");
  return `${baseUrl}/storage/v1/object/public/${BUCKET}/${cleanPath}`;
}

export function getPlaceholderImage(label: string): string {
  const encoded = encodeURIComponent(label);
  return `https://placehold.co/800x600/FAF6EF/003817?text=${encoded}`;
}
