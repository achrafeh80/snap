import { jwtDecode } from "jwt-decode";
export async function myId(token: string) {
	try {
		return (jwtDecode(token) as any).userId;
	} catch {
		return null;
	}
}