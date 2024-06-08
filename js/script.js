var productTitleInput = document.getElementById("productTitle");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productImageInput = document.getElementById("productImage");
var productDescriptionInput = document.getElementById("productDescription");

var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var productSearchInput = document.getElementById("productSearch");

var localProduct = "allProducts";
var productIDKey = "productIDCounter";

var allProducts = JSON.parse(localStorage.getItem(localProduct)) || [];
var productIDCounter = parseInt(localStorage.getItem(productIDKey)) || 0;

const form = document.getElementsByTagName("form")[0];

displayProduct(allProducts);

function addProduct() {
  if (
    validateFormInputs(productTitleInput) &&
    validateFormInputs(productPriceInput) &&
    validateFormInputs(productCategoryInput) &&
    validateFormInputs(productDescriptionInput) &&
    validateFormInputs(productImageInput)
  ) {
    var product = {
      id: ++productIDCounter,
      title: productTitleInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      description: productDescriptionInput.value,
      image: `fruityCandyImages/${productImageInput.files[0]?.name}`,
    };
    allProducts.push(product);
    localStorage.setItem(productIDKey, productIDCounter);
    addToLocalStorage();
    displayProduct(allProducts);
    clearInputs();
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  addProduct();
});

function addToLocalStorage() {
  localStorage.setItem(localProduct, JSON.stringify(allProducts));
}

function clearInputs(product) {
  productTitleInput.value = product ? product.title : "";
  productPriceInput.value = product ? product.price : "";
  productCategoryInput.value = product ? product.category : "";
  productDescriptionInput.value = product ? product.description : "";
  productImageInput.value = "";
}

function displayProduct(arr) {
  var blackBox = ``;
  for (var i = 0; i < arr.length; i++) {
    blackBox += `<div class="col-md-12 col-lg-6">
    <div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0 mx-4">
        <div class="col-md-4 d-flex align-items-center justify-content-center">
          <img src="${
            arr[i].image
          }" class="img-fluid rounded-circle text-center" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${
              arr[i].newTitle ? arr[i].newTitle : arr[i].title
            }</h5>
            <p class="card-text">${arr[i].description}</p>
            <h6 class="card-text">${arr[i].category}</h6>
            <p class="card-text"><small class="text-body-secondary">${
              arr[i].price
            }<b>$</b></small></p>
            <div>
              <a href="#form" class="btn btn-success" onclick="editProduct(${
                arr[i].id
              })">Update</a>
              <button class="btn btn-outline-danger" onclick="deleteProduct(${
                arr[i].id
              })">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  }
  document.getElementById("productRow").innerHTML = blackBox;
}

var indexToUpdate;
function editProduct(idToEdit) {
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  var productToEdit = allProducts.find((product) => product.id === idToEdit);
  indexToUpdate = idToEdit;
  clearInputs(productToEdit);
}

function updateProduct() {
  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");

  var productIndex = allProducts.findIndex(
    (product) => product.id === indexToUpdate
  );
  allProducts[productIndex].title = productTitleInput.value;
  allProducts[productIndex].price = productPriceInput.value;
  allProducts[productIndex].category = productCategoryInput.value;
  allProducts[productIndex].description = productDescriptionInput.value;

  if (productImageInput.files[0]) {
    allProducts[
      productIndex
    ].image = `fruityCandyImages/${productImageInput.files[0].name}`;
  }
  addToLocalStorage();
  displayProduct(allProducts);
  clearInputs();
}

function deleteProduct(id) {
  allProducts = allProducts.filter((product) => product.id !== id);
  addToLocalStorage();
  displayProduct(allProducts);
}

function searchProduct(text) {
  console.log(text);
  var matchedProducts = [];
  var lowerCaseText = text.toLowerCase();

  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].title.toLowerCase().includes(lowerCaseText)) {
      var highlightedTitle = allProducts[i].title.replace(
        new RegExp(`(${text})`, "gi"),
        (match) => `<span class="text-danger">${match}</span>`
      );
      matchedProducts.push({ ...allProducts[i], newTitle: highlightedTitle });
    }
  }

  if (matchedProducts.length > 0) {
    displayProduct(matchedProducts);
  } else {
    document.getElementById(
      "productRow"
    ).innerHTML = `<div class="col-12"><p class="text-center text-muted">No products found matching "${text}"</p></div>`;
  }
}

function validateFormInputs(ele) {
  var regex = {
    productTitle: /[A-Z][a-z]{2,10}/,
    productPrice: /^(100|[1-4]\d{2}|500)(\.\d{1,2})?$/,
    productCategory:
      /(Lollypops|Gummi Candy|Hard Candy|Suger Gummi Candy|Chocolate Candy)/,
    productDescription: /^[a-zA-Z]{5,250}$/,
    productImage: /\.(jpe?g|png|gif|jfif)$/i,
  };

  var isValid;
  if (ele.id == "productImage") {
    isValid = regex[ele.id].test(ele.files[0]?.name);
  } else {
    isValid = regex[ele.id].test(ele.value);
  }

  if (isValid) {
    console.log("Valid");
    if (ele.classList.contains("is-invalid")) {
      ele.classList.replace("is-invalid", "is-valid");
    } else {
      ele.classList.add("is-valid");
    }
    ele.nextElementSibling.classList.replace("d-block", "d-none");
  } else {
    console.log("InValid");
    if (ele.classList.contains("is-valid")) {
      ele.classList.replace("is-valid", "is-invalid");
    } else {
      ele.classList.add("is-invalid");
    }
    ele.nextElementSibling.classList.replace("d-none", "d-block");
  }
  return isValid;
}

// document
//   .getElementById("productRow")
//   .addEventListener("click", function (event) {
//     var target = event.target;
//     var action = target.getAttribute("data-action");
//     var productId = parseInt(target.getAttribute("data-product-id"));

//     if (action === "edit") {
//       editProduct(productId);
//     } else if (action === "delete") {
//       deleteProduct(productId);
//     }
//   });
