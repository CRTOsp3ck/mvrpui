import createClient from "openapi-fetch";
import type { paths } from "../schema";

const client = createClient<paths>({ baseUrl: "http://localhost:6900/" });

export default client;
