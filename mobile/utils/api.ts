import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_HOST = Constants.expoConfig?.extra?.apiHost;

export async function API(
  path: string,
  options: RequestInit = {},
  isForm = false
) {
  const token = await SecureStore.getItemAsync('TOKEN');
  const headers: any = options.headers || {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_HOST}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res;
}
