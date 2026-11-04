export const env = {
  /** Empty in dev -> relative `/api` goes through the Vite proxy. */
  apiUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? "",
};
