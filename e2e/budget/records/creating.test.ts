import { IBudgetRecord } from "#interfaces/budget"

import { budgetCategories } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Budget record creating", () => {
  it("a newly created record is presented in all records list", async () => {
    await fetchApi("/api/budget/records", {
      body: JSON.stringify({ amount: 2000, categoryId: budgetCategories.clothesExpense.id, date: "2022-08-05" }),
      method: "POST",
    })
    const getAllCategoriesResponse = await fetchApi("/api/budget/records/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IBudgetRecord>({
      amount: 2000,
      category: budgetCategories.clothesExpense,
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })

  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { amount: 0, categoryId: budgetCategories.clothesExpense.id, date: "2022-08-05" },
      response: { fields: { amount: "Should be a positive number." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId_WITH_A_TYPO: 1, date: "2022-08-05" },
      response: { fields: { categoryId: "Required field." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 666666, date: "2022-08-05" },
      response: { fields: { categoryId: "Invalid category." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: budgetCategories.clothesExpense.id, date_WITH_A_TYPO: "2022-08-05" },
      response: { fields: { date: "Required field." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: budgetCategories.clothesExpense.id, date: "2022/08/05" },
      response: { fields: { date: "Should have format YYYY-MM-DD." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: budgetCategories.clothesExpense.id, date: "2022-08-05" },
      response: {
        amount: 2000,
        category: budgetCategories.clothesExpense,
        date: "2022-08-05",
        id: 7,
        isTrashed: false,
      },
      status: 201,
    },
  ])("Budget record creating case #%#", async ({ payload, response, status }) => {
    const recordCreatingResponse = await fetchApi("/api/budget/records", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(recordCreatingResponse.status).toEqual(status)
    expect(await recordCreatingResponse.json()).toEqual(response)
  })
})