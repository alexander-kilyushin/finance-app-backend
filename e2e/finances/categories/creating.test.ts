import { IFinanceCategory } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance category creating", () => {
  it("returns a correct response after creating", async () => {
    const categoryCreatingResponse = await fetchApi("/api/finances/categories", {
      body: JSON.stringify({ name: "food", typeId: 1 }),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(201)
    expect(await categoryCreatingResponse.json()).toEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("a newly created category is presented in all categories list", async () => {
    await fetchApi("/api/finances/categories", { body: JSON.stringify({ name: "food", typeId: 1 }), method: "POST" })
    const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("a newly created category can be found by ID", async () => {
    await fetchApi("/api/finances/categories", { body: JSON.stringify({ name: "food", typeId: 1 }), method: "POST" })
    const getNewlyCreatedCategoryResponse = await fetchApi("/api/finances/categories/6")
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("case: category name is not provided", async () => {
    const categoryCreatingResponse = await fetchApi("/api/finances/categories", {
      body: JSON.stringify({ name_WITH_A_TYPO: "food", typeId: 1 }),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(400)
    expect(await categoryCreatingResponse.json()).toEqual({
      fields: { name: "Required field." },
    })
  })

  it("case: category name is an empty string", async () => {
    const categoryCreatingResponse = await fetchApi("/api/finances/categories", {
      body: JSON.stringify({ name: "", typeId: 1 }),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(400)
    expect(await categoryCreatingResponse.json()).toEqual({
      fields: { name: "Required field." },
    })
  })

  it("case: category type is not provided", async () => {
    const categoryCreatingResponse = await fetchApi("/api/finances/categories", {
      body: JSON.stringify({ name: "food", typeId_WITH_A_TYPO: 1 }),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(400)
    expect(await categoryCreatingResponse.json()).toEqual({
      fields: { typeId: "Required field." },
    })
  })

  it("case: category type does not exist", async () => {
    const categoryCreatingResponse = await fetchApi("/api/finances/categories", {
      body: JSON.stringify({ name: "food", typeId: 1234123 }),
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(400)
    expect(await categoryCreatingResponse.json()).toEqual({
      fields: { typeId: "Invalid category type." },
    })
  })
})
