import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const categoryHeading = category
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const title = document.querySelector(".title");
if (title) {
  title.textContent = `Top Products: ${categoryHeading}`;
}
document.title = `Sleep Outside | ${categoryHeading}`;

const myList = new ProductList(category, dataSource, listElement);
myList.init();
