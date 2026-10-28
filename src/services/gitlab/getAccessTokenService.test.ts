import { proxyFetch } from "@deskpro/app-sdk";
import { getAccessTokenService } from "./getAccessTokenService";
import type { IDeskproClient } from "@deskpro/app-sdk";

jest.mock("@deskpro/app-sdk", () => ({
    proxyFetch: jest.fn(),
}));

const mockProxyFetch = proxyFetch as jest.MockedFunction<typeof proxyFetch>;

describe("getAccessTokenService", () => {
    const fetchSpy = jest.fn();

    beforeEach(() => {
        fetchSpy.mockResolvedValue({
            status: 200,
            json: async () => ({ access_token: "token" }),
        });
        mockProxyFetch.mockResolvedValue(fetchSpy);
    });

    test("should send credentials in a form-encoded body, not the query string", async () => {
        const client = {} as IDeskproClient;

        await getAccessTokenService(client, "abc123", "https://helpdesk.test/callback");

        const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];

        expect(url).toBe("__gitlab_instance_url__/oauth/token");
        expect(options.method).toBe("POST");
        expect(options.headers).toMatchObject({
            "Content-Type": "application/x-www-form-urlencoded",
        });

        const body = new URLSearchParams(options.body as string);

        expect(body.get("grant_type")).toBe("authorization_code");
        expect(body.get("client_id")).toBe("__app_id__");
        expect(body.get("client_secret")).toBe("__client_secret__");
        expect(body.get("code")).toBe("abc123");
        expect(body.get("redirect_uri")).toBe("https://helpdesk.test/callback");
    });
});
