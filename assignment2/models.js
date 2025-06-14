export class Item {
	constructor(id, name, price, size) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.size = size;
	}

	static fromJson(json) {
		const item = new Item(json.id, json.name, json.price, json.size);

		if (
			item.name == undefined ||
			item.price == undefined ||
			item.size == undefined ||
			!Size.isValid(item.size)
		) {
			throw new Error("Invalid Item");
		}

		return item;
	}
}
export class Size {
	static Small = "s";
	static Medium = "m";
	static Large = "l";

	static isValid(size) {
		return size === Size.Small || size === Size.Medium || size === Size.Large;
	}
}
