// URL to the API
const api_url="https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/";

// Function to show the loader
function showLoader() {
	document.querySelector('#loading').style.display = 'block';
}

// Function to hide the loader
function hideLoader() {
	document.querySelector('#loading').style.display = 'none';
}

async function getApiData(url) {
	try {
		let connection = await fetch(url);
		return await connection.json(); // produces an object
	} catch (error) {
		console.log(error);
	}
}

async function processCategories() {
	/*
		- get categories from API
		- hide the "loading" in the nav
		- show the radio button and label for each category inside <nav>
	*/
	let results = await getApiData(api_url+"categories");
	console.log(typeof(results)); // = object, because getApiData returns an object
	console.log(results);
	
	let html = '<span>Filter: </span>';

	results.forEach(category => {
		let htmlSegment = `<label>
			<input type="radio" name="category" onclick="processItems(${category.id});">
			 ${category.name}</label>`;
		html += htmlSegment;
	});

	let categoryContainer = document.querySelector('nav');
	
	categoryContainer.innerHTML = html;

	hideLoader();
	hideItem();
	listStyle();
}

async function processItems(category) {
	/*
		- show "loading" message
		- get list of items for chosen category from API
		- hide "loading" message
		- hide the "choose filter category above" instructions
		- add a table row for each item inside the table body
	*/
	
	console.log(`got processItems(${category})`);

	showLoader();

	// results will contain a json object
	let results = await getApiData(api_url+"categories/"+category+"/items");

	hideLoader();

	console.log(results);
	console.log(results.items[0].price);

	// Look at the items data from the API. Notice that there's a property called "items" and
	// one called "totalCount":
	//console.log(results['totalCount']);

	let html = `<thead>
		<tr>
			<th colspan="2" id="item">Item</th>
			<th id="desc">Description</th>
			<th id="price">Price</th>
		</tr>
	</thead>`;
	let htmlGrid = '';

	results.items.forEach((item, index) => {
		let htmlSegment = `<tr onclick="displayItem(${item.categoryId}, ${item.itemId}, ${index})">
        	<td><img src="${item.image[0]}" alt="${item.itemBrief}"></td>
        	<td>${item.itemName}</td>
        	<td>${item.itemBrief}</td>
        	<td>$${item.price}</td>
    	</tr>`;
		html += htmlSegment;
	});

	results.items.forEach((item, index) => {
		let htmlGridSegment = `<div onclick="displayItem(${item.categoryId}, ${item.itemId}, ${index})" class="grid-item">
			<img src="${item.image[0]}"  alt="${item.itemBrief})">
			<div class="grid-item-name">
				${item.itemName}
			</div>
			<div class="grid-item-price">
				$${item.price}
			</div>
			<p>${item.itemBrief}</p>
		</div>`;
		htmlGrid += htmlGridSegment;
	});

	let itemsTable = document.getElementById('listView');
    itemsTable.innerHTML = html;
	let itemsGrid = document.getElementById('gridView');
	itemsGrid.innerHTML = htmlGrid;
}

async function displayItem(category, id, idx) {
	/*
		- hide <nav> #categories
		- hide #listView
		- show #itemView
	*/
	document.getElementById('categories').style.display = 'none';
	document.getElementById('listView').style.display = 'none';
	document.getElementById('gridView').style.display = 'none';
	document.getElementById('itemView').style.display = 'block';
	document.getElementById('listButton').style.display = 'none';
	document.getElementById('gridButton').style.display = 'none';

	showLoader();

	// objects for wrapper of everything except item attributes
	let thumbnailImagesDiv = document.getElementById('thumbnail-images');
	let htmlItemTitle = document.getElementById('itemTitle')
	let htmlGalleryContainer = document.getElementById('gallery-container');

	// item view wrapper
	let html = document.getElementById('itemView');

	let results = await getApiData(api_url+"categories/"+category+"/items");
	let itemResult = await results.items[idx];

	hideLoader();

	html.innerHTML = '';
	console.log(html);

	// button for closing
	let htmlButton = '<button id="closeButton" onclick="hideItem();">x</button>';
	
	// #itemTitle
    let htmlItemTitleSegment =`<h1 id="itemTitle">
		<span id="itemView_price">$${itemResult.price}</span>
        <span id="itemView_item">${itemResult.itemName}</span>
	</h1>`;
    htmlItemTitle.innerHTML = htmlItemTitleSegment;

    // #galleryContainer
    let htmlCurrentImage = `<div id="current-image">
        <img src="${itemResult.image[0]}" alt="${itemResult.itemBrief}" id="main-image">
    </div>`;

    // Construct the gallery images
    let htmlGalleryImages = '';
    itemResult.image.forEach((image) => {
        let htmlGalleryImageSegment = `<img src="${image}" alt="${itemResult.itemBrief}" id="thumbnail-image" onclick="loadImage(this);">`;
        htmlGalleryImages += htmlGalleryImageSegment;
    });

    // Wrap the gallery images in a div
    let htmlGalleryDiv = `<div id="gallery-thumbnails">${htmlGalleryImages}</div>`;

	htmlGalleryContainer = `<section id="gallery-container">
		${htmlCurrentImage}
		${htmlGalleryDiv}
	</section>`;

    // #itemDetails
    let htmlItemDetails = `<div id="itemDescription"><p>${itemResult.itemFull}</p></div>`;

	// sizes
	let htmlSizes = '<option selected disabled>Choose your size</option>';
	itemResult.size.forEach((size) => {
		let htmlSizeSegment = `<option>${size}</option>`
		htmlSizes += htmlSizeSegment
	})
	console.log(htmlSizes);
	let htmlSizesSelect = `<select>${htmlSizes}</select>`;

	// colors
	let htmlColors = '<option selected disabled>Choose your color</option>';
	itemResult.colors.forEach((color) => {
		let htmlColorSegment = `<option>${color}</option>`
		htmlColors += htmlColorSegment
	})
	console.log(htmlColors);
	let htmlColorsSelect = `<select>${htmlColors}</select>`;

	// qty
	let htmlQty = `<option selected disabled>Choose your quantity</option>
	<option>1</option>
	<option>2</option>
	<option>3</option>
	<option>4</option>`;
	console.log(htmlQty);
	let htmlQtySelect = `<select>${htmlQty}</select>`;

	// #itemAttributes
	let htmlItemAttributes = `<label>Size:
		${htmlSizesSelect}
	</label>
	<label>Color:
		${htmlColorsSelect}
	</label>
	<label>Qty:
		${htmlQtySelect}
	</label>`

	let htmlItemCharacter = `<div id="item-character">
		${htmlItemDetails}
		${htmlItemAttributes}
	</div>`;

	let htmlItemContainer = `<div id="item-container">
		${htmlGalleryContainer}
		${htmlItemCharacter}
	</div>`;

    // set the innerHTML of the itemView
    html.innerHTML = htmlButton + htmlItemTitleSegment + htmlItemContainer;

	//console.log(`got displayItem(${category}, ${id}, ${index})`);
	//console.log(itemResult);
}

function listStyle() {
	/*
		- change listView to display as a list
	*/
	document.getElementById('listView').style.display = 'block';
	document.getElementById('gridView').style.display = 'none';
}

function gridStyle() {
	/*
		- change listView to display as a list
	*/
	document.getElementById('listView').style.display = 'none';
	document.getElementById('gridView').style.display = 'block';
}


function hideItem() {
	/*
		- clear item elements
		- hide #itemView
		- show <nav> #categories
		- show #listView
	*/
	document.getElementById('categories').style.display = 'block';
	document.getElementById('listView').style.display = 'block';
	document.getElementById('itemView').style.display = 'none';
	document.getElementById('listButton').style.display = 'block';
	document.getElementById('gridButton').style.display = 'block';

	console.log('got hideItem()');
}

function loadImage(clickedImage) {
	/*
		- find the target image needing the new src
		- assign the src and alt properties from the clicked image to the target
	*/
	
	console.log(`got loadImage(${clickedImage})`);
	
	var mainImage = document.querySelector("#main-image");
	mainImage.src = clickedImage.src;
	mainImage.alt = clickedImage.alt;
}