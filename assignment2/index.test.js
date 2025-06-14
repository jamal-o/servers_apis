import request from "supertest";
import server from "./index";
import { JsonDatabaseService } from "./JsonDatabaseService";
import { Item } from "./models";

import { beforeEach, jest } from "@jest/globals";

jest.mock("./JsonDatabaseService");
// jest.mock("./JsonDatabaseService", () => {
// 	return jest.fn().mockImplementation(() => {
// 		console.log("mock used");
// 		return {
// 			createItem: jest.fn(),
// 			getItem: jest.fn(),
// 			getItems: jest.fn(),
// 			updateItem: jest.fn(),
// 			deleteItem: jest.fn(),
// 		};
// 	});
// });

describe("Api test", () => {
	beforeEach(() => {
		// JsonDatabaseService.mockClear();
	});
	describe("Should return 404", () => {
		it("when route undefined", async () => {
			const res = await request(server).get("/unknown");

			expect(res.status).toBe(404);
		});

		it("when id is not an integer", async () => {
			const res = await request(server).get("/items/abc");

			expect(res.status).toBe(404);
		});
	});

	describe("GET /items", () => {
		it("should return an empty array, when no items", async () => {
			const res = await request(server).get("/items");

			let staticMethodMock = jest
				.spyOn(JsonDatabaseService, "getItems")
				.mockImplementationOnce(() => {
					return [];
				});
			expect(res.status).toBe(200);
			expect(res.body).toEqual([]);
		});
	});

	describe("POST /items", () => {
		it("should create a new item", async () => {
			const newItem = new Item("1", "Test Item", 10, "m");
			let staticMethodMock = jest
				.spyOn(JsonDatabaseService, "createItem")
				.mockImplementationOnce(() => {
					return newItem;
				});

			const res = await request(server)
				.post("/items")
				.send({ name: "Test Item", price: 10, size: "m" });

			expect(res.status).toBe(201);
			expect(res.body).toEqual(JSON.parse(JSON.stringify(newItem)));
			expect(JsonDatabaseService.createItem).toHaveBeenCalledWith({
				name: "Test Item",
				price: 10,
				size: "m",
			});
		});

		it("should create a return error on bad item", async () => {
			const res = await request(server)
				.post("/items")
				.send({ name: "Test Item", price: 10, size: "big" });

			expect(res.status).toBe(400);
			expect(res.body).toEqual({ message: "Error: Invalid Item" });
			// let staticMethodMock = jest
			// 	.spyOn(JsonDatabaseService, "createItem")
			// 	.mockImplementationOnce(() => {
			// 		return newItem;
			// 	});
		});
	});

	describe("GET /items/:id", () => {
		it("should return an item by id", async () => {
			const newItem = new Item("1", "Test Item", 10, "m");
			let staticMethodMock = jest
				.spyOn(JsonDatabaseService, "getItem")
				.mockImplementationOnce(() => {
					return newItem;
				});
			JsonDatabaseService.getItem.mockReturnValue(newItem);
			const res = await request(server).get("/items/1");

			expect(res.status).toBe(200);
			expect(res.body).toEqual(JSON.parse(JSON.stringify(newItem)));
			expect(JsonDatabaseService.getItem).toHaveBeenCalledWith("1");
		});

		it("should return 400 if item not found", async () => {
			let staticMethodMock = jest
				.spyOn(JsonDatabaseService, "getItem")
				.mockImplementationOnce(() => {
					throw new Error("Item not found");
				});

			const res = await request(server).get("/items/1");

			expect(res.status).toBe(400);
			expect(res.body).toEqual({ message: "Error: Item not found" });
		});
	});

	describe("PATCH /items/:id", () => {
		it("should update an item", async () => {
			const updatedItem = new Item("1", "Updated Item", 20, "l");
			let staticMethodMock = jest
				.spyOn(JsonDatabaseService, "updateItem")
				.mockImplementationOnce(() => {
					return updatedItem;
				});
			const res = await request(server)
				.patch("/items/1")
				.send({ name: "Updated Item", price: 20, size: "l" });

			expect(res.status).toBe(200);
			expect(res.body).toEqual(JSON.parse(JSON.stringify(updatedItem)));
			expect(JsonDatabaseService.updateItem).toHaveBeenCalledWith({
				id: "1",
				name: "Updated Item",
				price: 20,
				size: "l",
			});
		});

		it("should return 400 if update fails", async () => {
			JsonDatabaseService.updateItem.mockImplementation(() => {
				throw new Error("Update failed");
			});
			const res = await request(server)
				.patch("/items/1")
				.send({ name: "Updated Item", price: 20, size: "l" });

			expect(res.status).toBe(400);
			expect(res.body).toEqual({ message: "Error: Update failed" });
		});
	});

	describe("DELETE /items/:id", () => {
		it("should delete an item", async () => {
			let staticMethodMock = jest
				.spyOn(JsonDatabaseService, "deleteItem")
				.mockImplementationOnce(() => {});
			const res = await request(server).delete("/items/1");

			expect(res.status).toBe(200);
			expect(JsonDatabaseService.deleteItem).toHaveBeenCalledWith("1");
		});

		it("should return 400 if delete fails", async () => {
			let staticMethodMock = jest
				.spyOn(JsonDatabaseService, "deleteItem")
				.mockImplementationOnce(() => {
					throw new Error("Delete failed");
				});
			const res = await request(server).delete("/items/1");

			expect(res.status).toBe(400);
			expect(res.body).toEqual({ message: "Error: Delete failed" });
		});
	});
});
