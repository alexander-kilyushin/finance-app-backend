import { GroupEntity } from "../../src/models/groups/entities/group.entity"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Responds with a group found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: GroupEntity | unknown }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "/api/groups/1",
      responseStatus: 200,
      responseData: {
        id: 1,
        name: "clever-financiers",
        subject: { id: 1, name: "finances" },
        users: [
          {
            id: 1,
            username: "john-doe",
            password: "8bd309ffba83c3db9a53142b052468007b",
          },
        ],
      },
    },
  ])("group search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})