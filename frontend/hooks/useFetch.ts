import { useState } from "react";

export const useFetch = (baseUrl: string) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (url: string, options: RequestInit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl + url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        console.log("❌ Status:", response.status, response.statusText);
        throw new Error(`Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const get = (url: string) => request(url, { method: "GET" });
  const post = (url: string, body: any) =>
    request(url, { method: "POST", body: JSON.stringify(body) });
  const put = (url: string, body: any) =>
    request(url, { method: "PUT", body: JSON.stringify(body) });
  const del = (url: string) => request(url, { method: "DELETE" });

  return { isLoading, error, get, post, put, del };
};
