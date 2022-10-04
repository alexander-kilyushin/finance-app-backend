import { BoardEntity } from "#models/boards/entities/board.entity"

import { boards, boardsSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Responds with a board found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: BoardEntity | unknown }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: `/api/boards/${boards.cleverFinanciers.id}`,
      responseStatus: 200,
      responseData: boards.cleverFinanciers,
    },
    {
      url: "/api/boards/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("board search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Boards search", () => {
  test.each<{ url: string; searchResult: (BoardEntity | unknown)[] }>([
    {
      url: `/api/boards/search?id=${boards.cleverFinanciers.id}`,
      searchResult: [boards.cleverFinanciers],
    },
    {
      url: `/api/boards/search?id=${boards.cleverFinanciers.id},${boards.beautifulSportsmen.id}`,
      searchResult: [boards.cleverFinanciers, boards.beautifulSportsmen],
    },
    {
      url: "/api/boards/search?id=666666",
      searchResult: [],
    },
    {
      url: "/api/boards/search",
      searchResult: [boards.cleverFinanciers, boards.megaEconomists, boards.beautifulSportsmen],
    },
    {
      url: `/api/boards/search?subjectId=${boardsSubjects.finances.id}`,
      searchResult: [boards.cleverFinanciers, boards.megaEconomists],
    },
    {
      url: "/api/boards/search?name=me",
      searchResult: [boards.megaEconomists, boards.beautifulSportsmen],
    },
    {
      url: `/api/boards/search?name=me&subjectId=${boardsSubjects.finances.id}&id=${boards.megaEconomists.id}`,
      searchResult: [boards.megaEconomists],
    },
  ])("boards search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})