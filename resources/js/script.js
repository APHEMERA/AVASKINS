///////////////////////////////////  H E A D E R

const mainSearchParamfunction = (key, value, testword, key2, value2, key3, value3) => {
  let params = new URLSearchParams(window.location.search);

  switch (testword) {
    case "subcatCategory":
    case "caseName":
    case "allCategory":
      params.set(key, value);
      params.delete("name");
      params.delete("wear");
      params.delete("search");
      return params;
    case "marketItem":
      params.set(key, value);
      params.set(key2, value2);
      params.set(key3, value3);
      params.delete("search");
      return params;
    case "searchItem":
    case "currentItemCatalog":
    case "hovercatCategory":
    case "newContent":
      params.set(key, value);
      params.set(key2, value2);
      params.delete("wear");
      params.delete("search");
      return params;
    case "wearsItem":
      params.set(key, value);
      params.set(key2, value2);
      params.delete("search");
      return params;
    case "caseCaseName":
    case "stickers":
    case "patches":
    case "musickits":
      params.set(key, value);
      params.set(key2, value2);
      params.delete("wear");
      params.delete("search");
      return params;
    case "searchBtn":
      params.set(key, value);
      params.delete("type");
      params.delete("name");
      params.delete("wear");
      return params;
  }
};

const removeChilds = (node) => {
  Array.from(node).forEach((element, i) => {
    element.parentNode.removeChild(node[i]);
  });
};

const opacityFunc = (selector) => {
  selector.forEach((item, i) => {
    if (!item.classList.contains("displayed")) {
      setTimeout(() => {
        item.style.opacity = "1";
      }, 55);
    }
  });
};

const buttonWrapperPrev = document.querySelector(".buttonWrapper-prev");
const buttonWrapperNext = document.querySelector(".buttonWrapper-next");

const headerMenu = document.querySelector(".header-menu");
const headerMenuList = document.querySelector(".header-menu-list");
const headerMenuItem = document.querySelectorAll(".header-menu-item");

const headerMenuSubcat = document.querySelector(".header-menu-subcat");
const headerMenuSubcatContainer = document.querySelector(".header-menu-subcat-container");

let lastTargeredSubcatId;
let allContentCategoryArr = [];

const headerMenuSubcatAll = document.querySelector(".header-menu-subcat-all");
const headerMenuSubcatAllContent = document.querySelector(".header-menu-subcat-all-content");
const subcatAllContentSpan = document.querySelector(".header-menu-subcat-all-content span");

const setSubcatAllContentCategory = (category) => {
  headerMenuSubcatAll.querySelector("a").href = `market.html?${mainSearchParamfunction(
    "type",
    `category/${category}`,
    "allCategory"
  )}`;
  subcatAllContentSpan.textContent = `check all ${category}`;
};

const displaySubcatItemsByCurrentId = (e) => {
  let targeredSubcatId = e.target.id;
  if (targeredSubcatId != "" && lastTargeredSubcatId == targeredSubcatId) {
    return;
  }

  const isDropdownbutton = e.target.matches(".header-menu-item");
  const isSubcatContainer = e.target.matches(".header-menu-subcat-container");
  const closeSubcatContainerBtn = document.querySelector(".closeSubcatContainerBtn");

  if (isDropdownbutton && targeredSubcatId != "") {
    let targeredName = e.target.textContent;
    setSubcatAllContentCategory(targeredName);

    buttonWrapperNext.classList.add("block");
    buttonWrapperPrev.classList.add("block");

    buttonWrapperNext.style.visibility = "visible";
    buttonWrapperPrev.style.visibility = "hidden";

    closeSubcatContainerBtn.classList.add("block");

    headerMenuSubcatContainer.classList.add("flex");
    headerMenuSubcat.classList.add("block");

    headerMenuSubcatAll.classList.add("block");
    setTimeout(() => {
      buttonWrapperNext.style.opacity = "1";
      buttonWrapperPrev.style.opacity = "1";

      headerMenuSubcatContainer.style.opacity = "1";
      closeSubcatContainerBtn.style.opacity = "1";

      headerMenuSubcatAll.style.opacity = "1";
    }, 50);
  } else if (
    targeredSubcatId == "" &&
    !isSubcatContainer &&
    !e.target.closest(".buttonWrapper-next") &&
    !e.target.closest(".buttonWrapper-prev") &&
    !e.target.closest(".hovercat-btnWrapper-next") &&
    !e.target.closest(".hovercat-btnWrapper-prev")
  ) {
    headerMenuItem.forEach((lnk) => lnk.classList.remove("isActive"));

    headerMenuSubcatContainer.classList.remove("flex");
    headerMenuSubcatContainer.style.opacity = "0";

    closeSubcatContainerBtn.classList.remove("block");
    closeSubcatContainerBtn.style.opacity = "0";

    headerMenuSubcat.classList.remove("block");

    headerMenuSubcatHovercat.classList.remove("flex");
    headerMenuSubcatHovercat.style.opacity = "0";

    headerMenuSubcatAll.classList.remove("block");
    headerMenuSubcatAll.style.opacity = "0";
  }
  if (isDropdownbutton) {
    if (headerMenuSubcatContainer.contains(document.querySelector(".header-menu-subcat-item")) && !isSubcatContainer) {
      firstSubcatItemObserver.unobserve(document.querySelector(".header-menu-subcat-container a"));
      lastSubcatItemObserver.unobserve(document.querySelector(".header-menu-subcat-container a:last-child"));

      const node = document.querySelectorAll(".header-menu-subcat-container a");
      node.forEach((item) => {
        item.remove();
      });
    }
    allContentCategoryArr = [];
    getSubcatItems(targeredSubcatId, setSubcatIntersectionObserver);
  }
  lastTargeredSubcatId = e.target.id;
};
window.addEventListener("click", displaySubcatItemsByCurrentId);

const setSubcatIntersectionObserver = () => {
  firstSubcatItemObserver.observe(document.querySelector(".header-menu-subcat-container a"));
  lastSubcatItemObserver.observe(document.querySelector(".header-menu-subcat-container a:last-child"));
};

const headerMenuSubcatTemplate = document.querySelector("[data-header-menu-subcat-template]");

async function getSubcatItems(targeredSubcatId, callback) {
  const url = "./resources/data/csgo-items-db-master/schemas/types.json";
  const response = await fetch(url);
  const data = await response.json();
  const displayCategories = (categories) => {
    categories.forEach((element, i) => {
      if (element.category == targeredSubcatId) {
        const item = headerMenuSubcatTemplate.content.cloneNode(true);

        const itemName = item.querySelector("[data-header-menu-subcat-name]");
        const itemImage = item.querySelector("[data-header-menu-subcat-image]");
        const subcatItem = item.querySelector("[data-header-menu-subcat-item]");
        const itemImageContainer = item.querySelector(".image-subcat-container");
        const item_aLink = item.querySelector("[data-header-menu-subcat-item-aLink]");

        itemName.textContent = element.name;
        itemName.setAttribute("name", element.name);
        itemImage.src = element.image;
        itemImage.setAttribute("title", element.name);
        itemImage.setAttribute("alt", element.name);
        itemImage.setAttribute("name", element.name);
        itemImageContainer.setAttribute("name", element.name);
        subcatItem.setAttribute("name", element.name);

        item_aLink.href = `market.html?${mainSearchParamfunction("type", element.name.trim(), "subcatCategory")}`;
        allContentCategoryArr.push(element.name);
        headerMenuSubcatContainer.append(item);
      }
    });
    let node = document.querySelectorAll(".header-menu-subcat-item");
    node.forEach((elem, i) => {
      setTimeout(() => {
        elem.style.transform = "translateY(0px)";
        elem.style.opacity = "1";
      }, i * 55);
    });
  };
  displayCategories(data.list);
  callback();
  sessionStorage.setItem("categories", JSON.stringify(allContentCategoryArr));
}

window.addEventListener("mouseover", (e) => {
  if (
    !e.target.closest(".header-menu-subcat-item") &&
    !e.target.closest(".header-menu-subcat-hovercat") &&
    !e.target.closest(".closeSubcatContainerBtn")
  ) {
    const headerMenuSubcatItems = document.querySelectorAll(".header-menu-subcat-item");
    headerMenuSubcatItems.forEach((item) => {
      item.querySelector("span").style.color = "#f6f8e4";
      item.style.boxShadow = "none";
      item.querySelector(".subcat-item-bottomTriangle").style.opacity = "0";
      item.querySelector(".subcat-item-bottomTriangle").style.bottom = "-15px";
    });
  }
});

headerMenuItem.forEach((link) => {
  link.addEventListener("click", (e) => {
    headerMenuItem.forEach((lnk) => lnk.classList.remove("isActive"));
    e.target.classList.add("isActive");
  });
});

const firstSubcatItemObserver = new IntersectionObserver(
  (entries) => {
    const firstItem = entries[0];
    firstItem.isIntersecting
      ? (buttonWrapperPrev.style.visibility = "hidden")
      : (buttonWrapperPrev.style.visibility = "visible");
  },
  {
    threshold: 1,
  }
);
const lastSubcatItemObserver = new IntersectionObserver(
  (entries) => {
    const lastItem = entries[0];
    lastItem.isIntersecting
      ? (buttonWrapperNext.style.visibility = "hidden")
      : (buttonWrapperNext.style.visibility = "visible");
  },
  {
    threshold: 1,
  }
);

const scrollSubcatContainer = (e) => {
  if (e.target.closest(".buttonWrapper-next")) {
    headerMenuSubcatContainer.scrollLeft += headerMenuSubcatContainer.clientWidth - 70;
  } else if (e.target.closest(".buttonWrapper-prev")) {
    headerMenuSubcatContainer.scrollLeft -= headerMenuSubcatContainer.clientWidth - 70;
  }
};
buttonWrapperNext.addEventListener("click", scrollSubcatContainer);
buttonWrapperPrev.addEventListener("click", scrollSubcatContainer);

///// H O V E R C A T
const headerMenuSubcatHovercat = document.querySelector(".header-menu-subcat-hovercat");
const headerMenuSubcatHovercatContainer = document.querySelector(".header-menu-subcat-hovercat-container");
const dataHeaderMenuSubcatHovercatTemplate = document.querySelector("[data-header-menu-subcat-hovercat-template]");
const hovercatBtns = document.querySelectorAll("[data-hovercat-btn]");

window.addEventListener("mouseover", (e) => {
  const isHeaderHovercatContainer = e.target.closest(".header-menu-subcat-hovercat-container");
  const isHeaderSubcatItem = e.target.closest(".header-menu-subcat-item");
  const isHeaderHovercatItem = e.target.closest(".hovercat-item");
  const isHovercatbtnWrapperPrev = e.target.closest(".hovercat-btnWrapper-prev");
  const isHovercatbtnWrapperNext = e.target.closest(".hovercat-btnWrapper-next");
  const isItemImageContainer = e.target.closest(".image-subcat-container img");
  const isCloseSubcatContainerBtn = e.target.closest(".closeSubcatContainerBtn");

  if (isHeaderSubcatItem) {
    headerMenuSubcatHovercatContainer.style.cssText = "scroll-behavior: auto;";
    headerMenuSubcatHovercatContainer.scrollLeft = 0;
    headerMenuSubcatHovercatContainer.style.cssText = "scroll-behavior: smooth;";

    headerMenuSubcatHovercat.classList.add("flex");
    setTimeout(() => {
      headerMenuSubcatHovercat.style.opacity = "1";
    }, 50);
    if (!headerMenuSubcatHovercatContainer.classList.contains("skeletonPlaced")) {
      const hovercatItemsNode = document.querySelectorAll(".header-menu-subcat-hovercat-container a");
      hovercatItemsNode.forEach((item) => {
        item.remove();
      });

      skeletonHovercat();
      headerMenuSubcatHovercatContainer.classList.add("skeletonPlaced");
    }
  }
  if (e.target.closest(".header-menu-subcat-hovercat") || isCloseSubcatContainerBtn) {
    if (headerMenuSubcatHovercatContainer.classList.contains("skeletonPlaced")) {
      headerMenuSubcatHovercat.classList.remove("flex");
      headerMenuSubcatHovercat.style.opacity = "0";
      const node = document.querySelectorAll(".header-menu-subcat-hovercat-container a");
      removeChilds(node);

      const node2 = document.querySelectorAll(".hovercat-item-skeleton");
      removeChilds(node2);
      headerMenuSubcatHovercatContainer.classList.remove("skeletonPlaced");
    }
  }
  if (
    !isHeaderSubcatItem &&
    !isHeaderHovercatItem &&
    !isHovercatbtnWrapperPrev &&
    !isHovercatbtnWrapperNext &&
    !isItemImageContainer &&
    !isHeaderHovercatContainer &&
    !isCloseSubcatContainerBtn
  ) {
    headerMenuSubcatHovercat.classList.remove("flex");
    headerMenuSubcatHovercat.style.opacity = "0";
    headerMenuSubcatHovercatContainer.classList.remove("skeletonPlaced");
    const node = document.querySelectorAll(".header-menu-subcat-hovercat-container a");
    removeChilds(node);

    const node2 = document.querySelectorAll(".hovercat-item-skeleton");
    removeChilds(node2);
  }
});

let timer;
window.addEventListener("mousemove", (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    subcatMouseStoppedListener(e);
  }, 30);
});

window.addEventListener("mouseout", (e) => {
  if (e.target.matches(".header-menu-subcat-item")) {
    e.target.classList.remove("active");
  }
});

const subcatMouseStoppedListener = (e) => {
  const isHeaderSubcatItem = e.target.matches(".header-menu-subcat-item");
  if (isHeaderSubcatItem) {
    if (e.target.classList.contains("active")) {
      return;
    }
    let hovercatObjArr = [];
    let hoveredSubcatItemName = e.target.getAttribute("name");
    newTask = true;
    getHovercatJsonData(hoveredSubcatItemName, hovercatObjArr);

    e.target.classList.add("active");

    const headerMenuSubcatItems = document.querySelectorAll(".header-menu-subcat-item");
    headerMenuSubcatItems.forEach((item) => {
      item.querySelector("span").style.color = "#f6f8e4";
      item.style.boxShadow = "none";
      item.querySelector(".subcat-item-bottomTriangle").style.opacity = "0";
      item.querySelector(".subcat-item-bottomTriangle").style.bottom = "-15px";
    });

    e.target.querySelector(".subcat-item-bottomTriangle").style.opacity = "1";
    e.target.querySelector(".subcat-item-bottomTriangle").style.bottom = "0px";
    e.target.closest(".header-menu-subcat-item").querySelector("span").style.color = "#fa3719";
    e.target.style.boxShadow = "0px 0px 15px 4px #1d2021";

    setTimeout(() => {
      hovercatBtns.forEach((btn) => (btn.style.opacity = "1"));
    }, 50);
  }
};

hovercatBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.closest(".hovercat-btnWrapper-next")) {
      headerMenuSubcatHovercatContainer.scrollLeft += headerMenuSubcatHovercatContainer.clientWidth - 200;
    } else if (e.target.closest(".hovercat-btnWrapper-prev")) {
      headerMenuSubcatHovercatContainer.scrollLeft -= headerMenuSubcatHovercatContainer.clientWidth - 200;
    }
  });
});

async function getHovercatJsonData(name, array) {
  const url = "/resources/data/csgostash-scraper-master/data/cases/json/all_cases.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    getHovercatItems(name, array, data);
  } catch (err) {
    alert(`Something went wrong :(, try to restart website or try later. Error : ${err}`);
  }
}

const getHovercatItems = (name, array, data) => {
  loop1: for (let l = 0; l < data.list.length; l++) {
    for (let c in data.list[l].content) {
      data.list[l].content[c].forEach((element, i) => {
        element.name = element.name.replaceAll("★ ", "");
        if (typeof name === "string" && element.name.startsWith(name.trim())) {
          let hovItemObj = {
            itemName_Obj: element.name.split("|").pop("").trim(),
            itemNameNameAttr_Obj: element.name,
            itemImageSrc_Obj: null,
            itemImageALtAttr_Obj: element.name.split("|").pop("").trim(),
            itemImageTitleAttr_Obj: element.name.split("|").pop("").trim(),
            itemWears_Obj: [],
            itemST_Obj: null,
            itemSV_Obj: null,
            itemRarity_Obj: `${getCurrentRarityColor(c)}`,
            item_aLink_Obj: `market.html?${mainSearchParamfunction(
              "type",
              element.name.split("|")[0].trim(),
              "hovercatCategory",
              "name",
              element.name.split("|").pop("").trim()
            )}`,
          };

          for (let el in element.wears) {
            hovItemObj.itemImageSrc_Obj = element.wears[el];
            break;
          }
          for (let el in element.wears) {
            let wr = el
              .replace("-", " ")
              .split(" ")
              .map((e) => e[0])
              .join("");
            hovItemObj.itemWears_Obj.push(wr);
          }

          if (element.can_be_stattrak) {
            hovItemObj.itemST_Obj = "StatTrak™";
          }
          if (element.can_be_souvenir) {
            hovItemObj.itemSV_Obj = "Souvenir";
          }

          array.push(hovItemObj);
        }
      });
    }
  }
  displayHovercatObjectedItems(array);
};

const displayHovercatObjectedItems = (array) => {
  let length = array.length;
  const hovercatItemsNode = document.querySelectorAll(".header-menu-subcat-hovercat-container a");
  hovercatItemsNode.forEach((item) => {
    item.remove();
  });

  const node2 = document.querySelectorAll(".hovercat-item-skeleton");
  removeChilds(node2);

  headerMenuSubcatHovercatContainer.classList.remove("skeletonPlaced");

  for (let i = 0; i < length; i++) {
    const item = dataHeaderMenuSubcatHovercatTemplate.content.cloneNode(true);

    const itemImage = item.querySelector("[data-hovercat-item-image]");
    const itemName = item.querySelector("[data-hovercat-item-name]");
    const item_aLink = item.querySelector("[data-hovercat-item-aLink]");
    const itemWears = item.querySelector("[data-hovercat-item-wears]");
    const itemST = item.querySelector("[data-item-extra-st]");
    const itemSV = item.querySelector("[data-item-extra-sv]");
    const itemRarity = item.querySelector("[data-item-rarity]");

    itemName.textContent = array[i].itemName_Obj;
    itemName.setAttribute("name", array[i].itemNameNameAttr_Obj);
    itemImage.src = array[i].itemImageSrc_Obj;
    itemImage.setAttribute("title", array[i].itemImageTitleAttr_Obj);
    itemImage.setAttribute("alt", array[i].itemImageALtAttr_Obj);
    item_aLink.href = array[i].item_aLink_Obj;
    itemRarity.style.backgroundColor = array[i].itemRarity_Obj;

    itemST.textContent = array[i].itemST_Obj;
    itemSV.textContent = array[i].itemSV_Obj;

    array[i].itemWears_Obj.forEach((wear) => {
      const html = `<div class="hovercat-item-wear" data-item-wear>${wear}</div>`;
      itemWears.insertAdjacentHTML("afterbegin", html);
    });
    headerMenuSubcatHovercatContainer.append(item);
  }
  const hovercatItems = document.querySelectorAll(".hovercat-item");
  hovercatItems.forEach((elem, i) => {
    setTimeout(() => {
      elem.style.transform = "translateY(0px)";
      elem.style.opacity = "1";
    }, i * 55);
  });
};

const skeletonHovercat = () => {
  const html = `<div class="hovercat-item hovercat-item-skeleton">
  <div class="hovercat-item-image skeleton"></div>
  <div class="hovercat-item-name skeleton"></div>
  <div class="hovercat-item-extras">
    <div class="hovercat-item-extra skeleton"></div>
  </div>
  <div class="hovercat-item-wears">
    <div class="hovercat-item-wear skeleton"></div>
    <div class="hovercat-item-wear skeleton"></div>
    <div class="hovercat-item-wear skeleton"></div>
    <div class="hovercat-item-wear skeleton"></div>
    <div class="hovercat-item-wear skeleton"></div>
  </div>
</div>`;
  for (let i = 0; i < 12; i++) {
    headerMenuSubcatHovercatContainer.insertAdjacentHTML("afterbegin", html);
  }
  const skeletonHovercatItems = document.querySelectorAll(".hovercat-item-skeleton");
  skeletonHovercatItems.forEach((elem, i) => {
    setTimeout(() => {
      elem.style.opacity = "1";
    }, i * 55);
  });
};

///////////////////////////////////  N E W  C O N T E N T

const newContentItemsContainer = document.querySelector(".newContent-items-container");
const newContentRaritySubcatItems = document.querySelectorAll(".newContent-rarity-subcat-item");
const newContentRarity = document.querySelector(".newContent-rarity");
const RaritySubcatContainer = document.querySelector(".newContent-rarity-subcat-container");
const newContentItemsTemplate = document.querySelector("[data-newContent-items-template]");
const newContentBtns = document.querySelectorAll(".newConent-btn");

async function getNewItems() {
  const url = "./resources/data/csgostash-scraper-master/data/cases/json/snakebite_case.json";
  const response = await fetch(url);
  const data = await response.json();

  if (newContentItemsContainer.scrollLeft == 0) {
    document.querySelector("#newContent-buttonWrapper-prev").style.visibility = "hidden";
  }
  displayCategories(data.content[a]);
}
const displayCategories = (items) => {
  items.forEach((element, i) => {
    element.name = element.name.replaceAll("★ ", "");
    const item = newContentItemsTemplate.content.cloneNode(true);

    const itemImage = item.querySelector("[data-content-item-image]");
    const itemName = item.querySelector("[data-content-item-name]");
    const itemDesc = item.querySelector("[data-content-item-desc]");
    const item_aLink = item.querySelector("[data-content-item-aLink]");

    item_aLink.href = `market.html?${mainSearchParamfunction(
      "type",
      element.name.split("|")[0].trim(),
      "newContent",
      "name",
      element.name.split("|").pop("").trim()
    )}`;
    itemImage.src = element.wears["Factory New"];
    itemImage.setAttribute("alt", element.name);
    itemName.textContent = element.name;
    itemDesc.textContent = element.desc;

    newContentItemsContainer.append(item);
  });
  setTimeout(() => {
    const node = document.querySelectorAll(".content-item");
    opacityFunc(node);
  }, 100);
  contentItemAnimations();
};

const contentItemAnimations = () => {
  const contentItemImages = document.querySelectorAll(".content-item-image img");
  const contentItemInfoLeftSpans = document.querySelectorAll(".content-item-info-left span");
  const contentItemInfoRightSpans = document.querySelectorAll(".content-item-info-right span");
  const contentItemInfoLeftParagraphs = document.querySelectorAll(".content-item-info-left p");
  contentItemImages.forEach((elem, i) => {
    setTimeout(() => {
      elem.style.opacity = "1";
    }, 350);
  });
  contentItemInfoLeftSpans.forEach((elem, i) => {
    setTimeout(() => {
      elem.style.transform = "translateY(0px)";
      elem.style.opacity = "1";
    }, 300);
  });
  contentItemInfoRightSpans.forEach((elem, i) => {
    setTimeout(() => {
      elem.style.transform = "translateY(0px)";
      elem.style.opacity = "1";
    }, 600);
  });
  contentItemInfoLeftParagraphs.forEach((elem, i) => {
    setTimeout(() => {
      elem.style.transform = "translateY(0px)";
      elem.style.opacity = "1";
    }, 400);
  });
};
let a = "Rare Special Items";

newContentRaritySubcatItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    a = e.target.getAttribute("name");
    let node = document.querySelectorAll(".content-item");
    removeChilds(node);
    getNewItems();
    newContentBtnWrapperNext.style.visibility = "visible";
  });
});
const newContentBtnWrapperNext = document.querySelector("#newContent-buttonWrapper-next");
const newContentBtnWrapperPrev = document.querySelector("#newContent-buttonWrapper-prev");

const setDefaultNewContentItemsProperties = () => {
  const contentItem = document.querySelectorAll(".content-item");
  contentItem.forEach((item) => {
    item.children[0].children[0].style.cssText = "transform: translateX(100px); opacity: 0";
    item.children[0].children[1].style.cssText = "transform: translateX(100px); opacity: 0";
    item.children[2].children[0].style.cssText = "transform: translateX(-50px);";
    item.children[1].children[0].style.cssText = "opacity: 0;";
    contentItemAnimations();
  });
};

newContentBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    setDefaultNewContentItemsProperties();
    if (e.target.closest("#newContent-buttonWrapper-next")) {
      setTimeout(() => {
        newContentBtnWrapperPrev.style.visibility = "visible";
        newContentItemsContainer.scrollLeft += newContentItemsContainer.clientWidth;
      }, 200);
    } else if (e.target.closest("#newContent-buttonWrapper-prev")) {
      setTimeout(() => {
        newContentBtnWrapperNext.style.visibility = "visible";
        newContentItemsContainer.scrollLeft -= newContentItemsContainer.clientWidth;
      }, 200);
    }
    setTimeout(() => {
      if (newContentItemsContainer.scrollWidth - 1000 == newContentItemsContainer.scrollLeft) {
        newContentBtnWrapperNext.style.visibility = "hidden";
      }
      if (newContentItemsContainer.scrollLeft == 0) {
        newContentBtnWrapperPrev.style.visibility = "hidden";
      }
    }, 200);
  });
});

const displayNewContent = () => {
  window.addEventListener("click", (e) => {
    if (e.target.closest(".newContent-rarity")) {
      RaritySubcatContainer.classList.toggle("block");
    } else {
      RaritySubcatContainer.classList.remove("block");
    }
  });
};
newContentRaritySubcatItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    let currentItem = e.target.textContent;
    document.querySelector(".currentRarity").textContent = currentItem;
  });
});

///////////// S E A R C H   M A I N   F U N C T I O N

const searchItemsContainer = document.querySelector(".search-items-container");

const searchInput = document.querySelector("[data-search]");
const searchItemTemplate = document.querySelector("[search-data-item-template]");

const searchBtn = document.querySelector(".search-button");

window.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    searchItemsContainer.classList.remove("flex");
  }
});

searchBtn.addEventListener("click", () => {
  let inputValue = searchInput.value.toLowerCase();
  if (inputValue.length > 2) {
    window.location.href = `market.html?${mainSearchParamfunction(
      "search",
      encodeURIComponent(inputValue),
      "searchBtn"
    )}`;
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

searchInput.addEventListener("input", (e) => {
  let value = e.target.value.replaceAll("|", "").replaceAll(" ", "").toLowerCase();

  let node = document.querySelectorAll(".search-items-container a");
  let lastValueChar = e.target.value.slice(-1);
  if (value.length > 2) {
    if (lastValueChar == " ") return;
    removeChilds(node);
    searchItemsContainer.classList.add("flex");
    document.querySelector(".search-button").classList.add("isVisible");
    searchItemsObjArr = [];
    getSearchedItems(value);
  } else {
    document.querySelector(".search-button").classList.remove("isVisible");
  }
});

async function getSearchedItems(value) {
  const url = "/resources/data/csgostash-scraper-master/data/cases/json/all_cases.json";
  const response = await fetch(url);
  const data = await response.json();

  for (let l = 0; l < data.list.length; l++) {
    for (let c in data.list[l].content) {
      data.list[l].content[c].forEach((element, i) => {
        element.name = element.name.replaceAll("★ ", "");
        if (element.name.replaceAll("|", "").replaceAll(" ", "").toLowerCase().includes(value)) {
          let itemObj = {
            itemName_Obj: element.name,
            itemImageSrc_Obj: null,
            itemImageALtAttr_Obj: element.name,
            item_aLink_Obj: `market.html?${mainSearchParamfunction(
              "type",
              element.name.split("|")[0].trim(),
              "searchItem",
              "name",
              element.name.split("|").pop("").trim()
            )}`,
          };

          for (el in element.wears) {
            itemObj.itemImageSrc_Obj = element.wears[el];
            break;
          }

          searchItemsObjArr.push(itemObj);
        }
      });
    }
  }
  searchStartPos = 0;
  searchEndPos = 10;
  displaySearchObjectedItems(searchStartPos, searchEndPos);
}

let searchStartPos = 0;
let searchEndPos = 10;

let searchItemsObjArr = [];

const displaySearchObjectedItems = (startPos, endPos) => {
  if (endPos > searchItemsObjArr.length) {
    endPos = searchItemsObjArr.length;
    searchObserver.disconnect();
  }
  let searchItems = document.querySelectorAll(".search-item");
  searchItems &&
    searchItems.forEach((item) => {
      item.classList.add("placed");
    });
  for (let i = startPos; i < endPos; i++) {
    const item = searchItemTemplate.content.cloneNode(true);

    const itemImage = item.querySelector("[search-data-item-image]");
    const itemName = item.querySelector("[search-data-item-name]");
    const item_aLink = item.querySelector("[search-data-item-aLink]");

    itemName.textContent = searchItemsObjArr[i].itemName_Obj;
    itemImage.src = searchItemsObjArr[i].itemImageSrc_Obj;
    itemImage.setAttribute("alt", searchItemsObjArr[i].itemImageALtAttr_Obj);
    item_aLink.href = searchItemsObjArr[i].item_aLink_Obj;

    searchItemsContainer.append(item);
  }
  const notPlacedSearchItems = document.querySelectorAll(".search-item:not(.placed)");
  notPlacedSearchItems.forEach((item, i) => {
    setTimeout(() => {
      item.style.cssText = "opacity: 1; transform: translateX(0);";
    }, i * 100);
  });
  if (endPos == searchItemsObjArr.length) return;
  searchObserver.observe(document.querySelector(".search-items-container a:last-child"));
};

const searchObserver = new IntersectionObserver((entries) => {
  const lastItem = entries[0];
  if (!lastItem.isIntersecting) return;

  searchObserver.unobserve(lastItem.target);

  searchStartPos += 10;
  searchEndPos += 10;
  displaySearchObjectedItems(searchStartPos, searchEndPos);
});
///////////////////////////////////  M A R K E T

///// SIDEBAR FILTER FUNCTIONS
const wearCheckboxInputs = document.querySelectorAll(".wear-filter-checkbox-item input");
const rarityCheckboxInputs = document.querySelectorAll(".rarity-filter-checkbox-item input");
const extraCheckboxInputs = document.querySelectorAll(".extra-filter-checkbox-item input");
const stickerVariantCheckboxInputs = document.querySelectorAll(".stickerVariant-filter-checkbox-item input");
const stickerVariantCheckboxInputsZero = document.querySelectorAll(".stickerVariant-filter-checkbox-item-zero input");
const stickerCapsuleCheckboxInputs = document.querySelectorAll(".stickerCapsule-filter-checkbox-item input");

const wearFilterCheckboxItems = document.querySelectorAll(".wear-filter-checkbox-item");
const rarityFilterCheckboxItems = document.querySelectorAll(".rarity-filter-checkbox-item");
const extraFilterCheckboxItems = document.querySelectorAll(".extra-filter-checkbox-item");
const stickerVariantFilterCheckboxItems = document.querySelectorAll(".stickerVariant-filter-checkbox-item");
const stickerVariantFilterCheckboxItemsZero = document.querySelectorAll(".stickerVariant-filter-checkbox-item-zero");
const stickerCapsuleFilterCheckboxItems = document.querySelectorAll(".stickerCapsule-filter-checkbox-item");

const displayhideOnlyspan = (selector) => {
  selector.forEach((item) => {
    if (item.classList.contains("stickerVariant-filter-checkbox-item-zero")) {
      return;
    }
    item.addEventListener("mouseover", () => item.querySelector("span").classList.add("block"));
    item.addEventListener("mouseout", () => item.querySelector("span").classList.remove("block"));
  });
};

wearFilterCheckboxItems.forEach(() => displayhideOnlyspan(wearFilterCheckboxItems));
rarityFilterCheckboxItems.forEach(() => displayhideOnlyspan(rarityFilterCheckboxItems));
extraFilterCheckboxItems.forEach(() => displayhideOnlyspan(extraFilterCheckboxItems));
stickerVariantFilterCheckboxItems.forEach(() => displayhideOnlyspan(stickerVariantFilterCheckboxItems));
stickerCapsuleFilterCheckboxItems.forEach(() => displayhideOnlyspan(stickerCapsuleFilterCheckboxItems));

let wearsArray = [];
let raritysArray = [];
let extrasArray = [];
let stickerVariantsArray = [];
let stickerCapsulesArray = [];

const pushAllInputs = (inputs, arr) => {
  inputs.forEach((input) => {
    input.checked = true;
    arr.push(input.value);
  });
};
const pushSelectedInputs = (inputs, arr) => {
  closeCatalogSearchLabel();
  arr.splice(0, arr.length);
  setTimeout(() => {
    inputs.forEach((input) => {
      if (input.checked == true) {
        arr.push(input.value);
      }
    });
    getMarketItems();
  }, 50);
};

pushAllInputs(wearCheckboxInputs, wearsArray);
pushAllInputs(rarityCheckboxInputs, raritysArray);
pushAllInputs(extraCheckboxInputs, extrasArray);
pushAllInputs(stickerVariantCheckboxInputsZero, stickerVariantsArray);
pushAllInputs(stickerCapsuleCheckboxInputs, stickerCapsulesArray);

const sortSpan = document.querySelector(".sort-span");

window.addEventListener("click", (e) => {
  if (e.target.closest(".wear-filter-checkbox-item label")) {
    sortSpan.textContent = "not sorted";
    pushSelectedInputs(wearCheckboxInputs, wearsArray);
  } else if (e.target.closest(".rarity-filter-checkbox-item label")) {
    sortSpan.textContent = "not sorted";
    pushSelectedInputs(rarityCheckboxInputs, raritysArray);
  } else if (e.target.closest(".extra-filter-checkbox-item label")) {
    sortSpan.textContent = "not sorted";
    pushSelectedInputs(extraCheckboxInputs, extrasArray);
  } else if (e.target.closest(".stickerVariant-filter-checkbox-item label")) {
    sortSpan.textContent = "not sorted";
    if (!e.target.parentElement.classList.contains("stickerVariant-filter-checkbox-item-zero")) {
      stickerVariantCheckboxInputsZero[0].checked = false;
      pushSelectedInputs(stickerVariantCheckboxInputs, stickerVariantsArray);
    } else {
      stickerVariantCheckboxInputs.forEach((input) => {
        input.checked = false;
      });
      pushSelectedInputs(stickerVariantCheckboxInputsZero, stickerVariantsArray);
    }
  } else if (e.target.closest(".stickerCapsule-filter-checkbox-item label")) {
    sortSpan.textContent = "not sorted";
    pushSelectedInputs(stickerCapsuleCheckboxInputs, stickerCapsulesArray);
  }
});

const checkSelectedInputs = (inputs, array) => {
  array.splice(0, array.length);
  pushAllInputs(inputs, array);
  getMarketItems();
  sortSpan.textContent = "not sorted";
};

const filterBtnsRight = document.querySelectorAll(".filter-content-header-right span");

filterBtnsRight.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    closeCatalogSearchLabel();
    if (e.target.closest(".filter-btn-wear")) {
      checkSelectedInputs(wearCheckboxInputs, wearsArray);
    } else if (e.target.closest(".filter-btn-rarity")) {
      checkSelectedInputs(rarityCheckboxInputs, raritysArray);
    } else if (e.target.closest(".filter-btn-extra")) {
      checkSelectedInputs(extraCheckboxInputs, extrasArray);
    } else if (e.target.closest(".filter-btn-stickerVariant")) {
      checkSelectedInputs(stickerVariantCheckboxInputs, stickerVariantsArray);
    } else if (e.target.closest(".filter-btn-stickerCapsule")) {
      checkSelectedInputs(stickerCapsuleCheckboxInputs, stickerCapsulesArray);
    }
  });
});

const wearOnlyBtn = document.querySelectorAll(".wear-filter-checkbox-item span");
const rarityOnlyBtn = document.querySelectorAll(".rarity-filter-checkbox-item span");
const extraOnlyBtn = document.querySelectorAll(".extra-filter-checkbox-item span");
const stickerVariantOnlyBtn = document.querySelectorAll(".stickerVariant-filter-checkbox-item span");
const stickerCapsuleOnlyBtn = document.querySelectorAll(".stickerCapsule-filter-checkbox-item span");

const dataOnlySpans = document.querySelectorAll("[data-only-span]");

dataOnlySpans.forEach((span) => {
  span.addEventListener("click", (e) => {
    closeCatalogSearchLabel();
    const isWearOnlyBtn = e.target.matches(".wear-filter-checkbox-item span");
    const isRarityOnlyBtn = e.target.matches(".rarity-filter-checkbox-item span");
    const isExtraOnlyBtn = e.target.matches(".extra-filter-checkbox-item span");
    const isStickerVariantOnlyBtn = e.target.matches(".stickerVariant-filter-checkbox-item span");
    const isStickerCapsuleOnlyBtn = e.target.matches(".stickerCapsule-filter-checkbox-item span");

    const displaySingleOption = (array, inputs) => {
      let current = e.target.offsetParent.querySelector("input").value;
      array.splice(0, array.length);
      inputs.forEach((input) => {
        if (input.value != current) {
          input.checked = false;
        }
        if (input.value == current) {
          input.checked = true;
        }
        if (input.checked == true) {
          array.push(input.value);
        }
      });
      getMarketItems();
    };
    if (isWearOnlyBtn) {
      displaySingleOption(wearsArray, wearCheckboxInputs);
      sortSpan.textContent = "not sorted";
    } else if (isRarityOnlyBtn) {
      displaySingleOption(raritysArray, rarityCheckboxInputs);
      sortSpan.textContent = "not sorted";
    } else if (isExtraOnlyBtn) {
      displaySingleOption(extrasArray, extraCheckboxInputs);
      sortSpan.textContent = "not sorted";
    } else if (isStickerVariantOnlyBtn) {
      displaySingleOption(stickerVariantsArray, stickerVariantCheckboxInputs);
      sortSpan.textContent = "not sorted";
    } else if (isStickerCapsuleOnlyBtn) {
      displaySingleOption(stickerCapsulesArray, stickerCapsuleCheckboxInputs);
      sortSpan.textContent = "not sorted";
    }
  });
});

const hideAllFilterOptions = () => {
  document.querySelector(".wear-filter-checkbox").parentElement.style.display = "none";
  document.querySelector(".rarity-filter-checkbox").parentElement.style.display = "none";
  document.querySelector(".extra-filter-checkbox").parentElement.style.display = "none";
  document.querySelector(".stickerVariant-filter-checkbox").parentElement.style.display = "none";
  document.querySelector(".stickerCapsule-filter-checkbox").parentElement.style.display = "none";
};

const hideAllFilterOptionsExceptSticker = () => {
  document.querySelector(".wear-filter-checkbox").parentElement.style.display = "none";
  document.querySelector(".rarity-filter-checkbox").parentElement.style.display = "none";
  document.querySelector(".extra-filter-checkbox").parentElement.style.display = "none";
};

const hideFilterOptionsSticker = () => {
  document.querySelector(".stickerVariant-filter-checkbox").parentElement.style.display = "none";
  document.querySelector(".stickerCapsule-filter-checkbox").parentElement.style.display = "none";
};
///// CATALOG SORT FUNCTIONS

const sortCatalogItems = (sortDescending, option, array) => {
  let elements = array;
  const node = document.querySelectorAll(".catalog-item-backWall");
  removeChilds(node);

  const compareWeaponNames = (el1, el2) => {
    if (
      el1.itemName_Obj.replace("Souvenir ", "").replace("StatTrak™ ", "") <
      el2.itemName_Obj.replace("Souvenir ", "").replace("StatTrak™ ", "")
    ) {
      return -1;
    } else if (
      el1.itemName_Obj.replace("Souvenir ", "").replace("StatTrak™ ", "") >
      el2.itemName_Obj.replace("Souvenir ", "").replace("StatTrak™ ", "")
    ) {
      return 1;
    } else {
      return 0;
    }
  };
  const compareSkinNames = (el1, el2) => {
    if (el1.itemName_Obj.split("|").pop("") < el2.itemName_Obj.split("|").pop("")) {
      return -1;
    } else if (el1.itemName_Obj.split("|").pop("") > el2.itemName_Obj.split("|").pop("")) {
      return 1;
    } else {
      return 0;
    }
  };
  const compareDates = (el1, el2) => {
    let date1 = new Date(el1.itemDate_added_Obj);
    let date2 = new Date(el2.itemDate_added_Obj);
    if (date1 < date2) {
      return 1;
    } else if (date1 > date2) {
      return -1;
    } else {
      return 0;
    }
  };
  const comparePrices = (el1, el2) => {
    if (parseFloat(el1.itemPrice_Obj) < parseFloat(el2.itemPrice_Obj)) {
      return 1;
    } else if (parseFloat(el1.itemPrice_Obj) > parseFloat(el2.itemPrice_Obj)) {
      return -1;
    } else {
      return 0;
    }
  };

  if (option == 1) {
    elements.sort(compareWeaponNames);
  } else if (option == 2) {
    elements.sort(compareSkinNames);
  } else if (option == 3) {
    elements.sort(compareDates);
  } else if (option == 4) {
    elements.sort(comparePrices);
  }

  if (sortDescending) {
    elements.reverse();
  }

  startPos = 0;
  endPos = 20;
  displayCatalogObjectedItems(array, startPos, endPos);

  const catalogItem = document.querySelectorAll(".catalog-item-backWall");
  catalogItem.forEach((item) => {
    item.style.opacity = 0;
  });
  opacityFunc(catalogItem, startPos);

  countMarketItems(array);
};

const hideCatalogSortTypes = (type) => {
  const sortSubcatItems = document.querySelectorAll(".sort-subcat-item");
  sortSubcatItems.forEach((item) => {
    if (!item.classList.contains(type) && !item.classList.contains("type0")) {
      item.style.display = "none";
    }
  });
};

const displayDate_added = () => {
  document.querySelectorAll(".date_added").forEach((date) => {
    date.classList.remove("invisible");
  });
};

const catalogItemsContainer = document.querySelector(".catalog-items-container");

window.addEventListener("click", (e) => {
  if (e.target.closest(".sort-subcat-item")) {
    const sortSpan = document.querySelector(".sort-span");

    if (!sortSpan.textContent.includes("date")) {
      document.querySelectorAll(".date_added").forEach((date) => {
        date.classList.add("invisible");
      });
    }

    let desc;
    let option;
    switch (sortSpan.textContent) {
      case "weapon name : a - z":
        desc = false;
        option = 1;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        break;
      case "weapon name : z - a":
        desc = true;
        option = 1;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        break;
      case "skin name : a - z":
        desc = false;
        option = 2;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        break;
      case "skin name : z - a":
        desc = true;
        option = 2;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        break;
      case "date added : newest to oldest":
        desc = false;
        option = 3;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        displayDate_added();
        break;
      case "date added : oldest to newest":
        desc = true;
        option = 3;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        displayDate_added();
        break;
      case "price : high to low":
        desc = false;
        option = 4;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        break;
      case "price : low to high":
        desc = true;
        option = 4;
        active ? sortCatalogItems(desc, option, catalogItemsObjArr) : sortCatalogItems(desc, option, objArr);
        break;
      default:
        const node = document.querySelectorAll(".catalog-item-backWall");
        removeChilds(node);

        closeCatalogSearchLabel();

        getMarketItems();
    }
  }
});

const displaySortCategories = () => {
  window.addEventListener("click", (e) => {
    const isSortButton = e.target.closest(".sort-button");
    const sortSubcatContainer = document.querySelector(".sort-subcat-container");
    const ioniconSort = document.querySelector(".sort-icon");
    if (isSortButton) {
      sortSubcatContainer.classList.contains("fade-in")
        ? sortSubcatContainer.classList.remove("fade-in")
        : sortSubcatContainer.classList.add("fade-in");

      let ionAttr = ioniconSort.getAttribute("name");
      ionAttr.startsWith("chevron-up")
        ? ioniconSort.setAttribute("name", "chevron-down-outline")
        : ioniconSort.setAttribute("name", "chevron-up-outline");

      changeSortItemsStyling();
    } else {
      sortSubcatContainer.classList.remove("fade-in");

      ioniconSort.setAttribute("name", "chevron-down-outline");
    }
  });
};

const hideCatalogSortSearch = () => {
  const catalogSortSearch = document.querySelector(".catalog-sort-search");

  const newParams = new URLSearchParams(window.location.search);
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");

  if (
    urlType != "Case" &&
    urlType != "Collection" &&
    urlType != "Souvenir" &&
    urlType != "Stickers" &&
    urlType != "Patches"
  ) {
    catalogSortSearch.style.display = "none";
  } else {
    catalogSortSearch.style.display = "flex";
  }
};

const changeSortItemsStyling = () => {
  const sortSubcatItems = document.querySelectorAll(".sort-subcat-item");
  const sortSpan = document.querySelector(".sort-span");

  sortSubcatItems.forEach((item) => {
    item.style.background = "none";
    item.style.color = "#686b6d";
    item.style.borderBottom = "1px solid rgba(29, 32, 33, 0.9)";
    if (sortSpan.textContent == item.textContent) {
      item.style.background = "#686b6d34";
      item.style.color = "#f6f8e4";
      item.style.borderBottom = "1px solid #fa3719";
    }
    item.addEventListener("click", (e) => {
      let currentSubcat = e.target;
      sortSpan.textContent = currentSubcat.textContent;
    });
  });
};
///////////// M A I N   M A R K E T   'GET ITEMS'   F U N C T I O N

const dataItemTemplate = document.querySelector("[data-item-template]");
const dataItemsContainer = document.querySelector("[data-catalog-items-container]");

const getRandomPrice = (min, max) => {
  return (Math.random() * (max - min + 1) + min).toFixed(2);
};

const countMarketItems = (array) => {
  let spanValue = document.querySelector(".itemValue");
  let num = array.length;
  if (num != 0) {
    document.querySelector(".catalog-items-alert").classList.remove("flex");
  }
  num == 1 ? (spanValue.textContent = `${num} Item`) : (spanValue.textContent = `${num} Items`);
};
const catalogSortSteps = document.querySelector(".catalog-sort-steps");
const catalogSortStep = document.querySelectorAll(".catalog-sort-step");

let objArr = [];
async function getMarketItems() {
  window.scrollTo(0, 0);

  objArr = [];

  const newParams = new URLSearchParams(window.location.search);

  let urlSearch = decodeURIComponent(newParams.get("search"));
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");
  let urlName = `${newParams.get("name")}`.replaceAll("★ ", "");
  let urlFullName = `${urlType} | ${urlName}`;

  const node1 = document.querySelectorAll(".catalog-sort-step");
  removeChilds(node1);

  if (urlType != "null") {
    const html = `<div class="catalog-sort-step">
    <a href="market.html?${mainSearchParamfunction("type", urlType, "subcatCategory")}">
      ${urlType}
      <ion-icon name="chevron-forward-sharp"></ion-icon>
    </a>
  </div>`;
    catalogSortSteps.insertAdjacentHTML("beforeend", html);
  }
  if (urlName != "null") {
    const html = `<div class="catalog-sort-step">
    <a href="market.html?${mainSearchParamfunction("type", urlType, "hovercatCategory", "name", urlName)}">
      ${urlName}
      <ion-icon name="chevron-forward-sharp"></ion-icon>
    </a>
  </div>`;
    catalogSortSteps.insertAdjacentHTML("beforeend", html);
  }
  if (urlSearch != "null") {
    const html = `<div class="catalog-sort-step">
      <a href="market.html?">
      Search results for : ${urlSearch}
      <ion-icon name="chevron-forward-sharp"></ion-icon>
      </a>
    </div>`;
    catalogSortSteps.insertAdjacentHTML("beforeend", html);
  }
  catalogSortSteps.lastChild.querySelector("ion-icon").remove();
  catalogSortSteps.lastElementChild.querySelector("a").removeAttribute("href");
  catalogSortSteps.lastElementChild.querySelector("a").style.color = "#fa3719";
  if (urlType.startsWith("category")) {
    const url = "/resources/data/csgostash-scraper-master/data/cases/json/all_cases.json";
    const response = await fetch(url);
    const data = await response.json();
    const node = document.querySelectorAll(".catalog-item-backWall");
    removeChilds(node);
    hideFilterOptionsSticker();

    let categorySessionArr = JSON.parse(sessionStorage.getItem("categories"));

    for (let l = 0; l < data.list.length; l++) {
      for (let c in data.list[l].content) {
        raritysArray.forEach((rarity) => {
          if (rarity == c) {
            data.list[l].content[c].forEach((element, i) => {
              element.name = element.name.replaceAll("★ ", "");
              categorySessionArr.forEach((category) => {
                if (element.name.startsWith(category)) {
                  for (let el in element.wears) {
                    filterHeaderName.textContent = urlType;

                    wearsArray.forEach((wear) => {
                      if (wear == el) {
                        let itemObj = {
                          itemName_Obj: element.name,
                          itemWear_Obj: el,
                          itemDesc_Obj: element.desc,
                          itemImageSrc_Obj: element.wears[el],
                          itemImageALtAttr_Obj: element.name,
                          itemDate_added_Obj: element.date_added,
                          itemCasename_Obj: data.list[l].name,
                          itemCaseimageSrc_Obj: data.list[l].image_url,
                          itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
                          itemRarity_Obj: c,
                          itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
                            "type",
                            data.list[l].name.split("|")[0],
                            "caseName"
                          )}`,
                          item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                            "type",
                            element.name.split("|")[0].trim(),
                            "marketItem",
                            "name",
                            element.name.split("|").pop("").trim(),
                            "wear",
                            el
                          )}'`,
                        };
                        objArr.push(itemObj);

                        extrasArray.forEach((ex) => {
                          if (ex == "StatTrak™") {
                            if (element.can_be_stattrak) {
                              let itemObjST = {
                                itemName_Obj: `StatTrak™ ${element.name}`,
                                item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                  "type",
                                  "StatTrak™ " + element.name.split("|")[0].trim(),
                                  "marketItem",
                                  "name",
                                  element.name.split("|").pop("").trim(),
                                  "wear",
                                  el
                                )}'`,
                              };
                              let itemObjCopy = Object.assign({}, itemObj);
                              objArr.push(Object.assign(itemObjCopy, itemObjST));
                            }
                          }
                          if (ex == "Souvenir") {
                            if (element.can_be_souvenir) {
                              let itemObjSV = {
                                itemName_Obj: `Souvenir ${element.name}`,
                                item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                  "type",
                                  "Souvenir " + element.name.split("|")[0].trim(),
                                  "marketItem",
                                  "name",
                                  element.name.split("|").pop("").trim(),
                                  "wear",
                                  el
                                )}'`,
                              };
                              let itemObjCopy = Object.assign({}, itemObj);
                              objArr.push(Object.assign(itemObjCopy, itemObjSV));
                            }
                          }
                        });
                      }
                    });
                  }
                }
              });
            });
          }
        });
      }
    }
  } else if (urlType == "Souvenir") {
    const url = "/resources/data/csgostash-scraper-master/data/souvenir_packages/json/all_souvenirPackages.json";
    const response = await fetch(url);
    const data = await response.json();

    hideAllFilterOptions();

    hideCatalogSortTypes("type1");

    for (let l = 0; l < data.list.length; l++) {
      let itemObj = {
        itemName_Obj: data.list[l].name,
        itemWear_Obj: null,
        itemDesc_Obj: null,
        itemImageSrc_Obj: data.list[l].image_url,
        itemImageALtAttr_Obj: data.list[l].name,
        itemDate_added_Obj: null,
        itemCasename_Obj: data.list[l].name,
        itemCaseimageSrc_Obj: data.list[l].image_url,
        itemPrice_Obj: `${getRandomPrice(50, 500)} USD`,
        itemRarity_Obj: null,
        itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
          "type",
          data.list[l].name.split("|")[0],
          "caseName"
        )}`,
        item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
          "type",
          "Souvenir",
          "caseCaseName",
          "name",
          data.list[l].name
        )}'`,
      };
      objArr.push(itemObj);
    }
  } else if (urlType.includes("Package")) {
    const url = "/resources/data/csgostash-scraper-master/data/souvenir_packages/json/all_souvenirPackages.json";
    const response = await fetch(url);
    const data = await response.json();
    const node = document.querySelectorAll(".catalog-item-backWall");
    removeChilds(node);
    hideFilterOptionsSticker();
    hideCatalogSortTypes("type1");
    for (let l = 0; l < data.list.length; l++) {
      if (data.list[l].name == urlType.trim()) {
        for (let c in data.list[l].content) {
          raritysArray.forEach((rarity) => {
            if (rarity == c) {
              data.list[l].content[c].forEach((element, i) => {
                element.name = element.name.replaceAll("★ ", "");
                for (let el in element.wears) {
                  document.querySelector(".filter-header-name").textContent = urlType;
                  wearsArray.forEach((wear) => {
                    if (wear == el) {
                      let itemObj = {
                        itemName_Obj: element.name,
                        itemWear_Obj: el,
                        itemDesc_Obj: element.desc,
                        itemImageSrc_Obj: element.wears[el],
                        itemImageALtAttr_Obj: element.name,
                        itemDate_added_Obj: element.date_added,
                        itemCasename_Obj: data.list[l].name,
                        itemCaseimageSrc_Obj: data.list[l].image_url,
                        itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
                        itemRarity_Obj: c,
                        itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
                          "type",
                          data.list[l].name.split("|")[0],
                          "caseName"
                        )}`,
                        item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                          "name",
                          element.name.split("|").pop("").trim(),
                          "marketItem",
                          "wear",
                          el,
                          "type",
                          element.name.split("|")[0].trim()
                        )}'`,
                      };

                      objArr.push(itemObj);

                      extrasArray.forEach((ex) => {
                        if (ex == "Souvenir") {
                          if (element.can_be_souvenir) {
                            let itemObjSV = {
                              itemName_Obj: `Souvenir ${element.name}`,
                              item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                "type",
                                "Souvenir " + element.name.split("|")[0].trim(),
                                "marketItem",
                                "name",
                                element.name.split("|").pop("").trim(),
                                "wear",
                                el
                              )}'`,
                            };
                            let itemObjCopy = Object.assign({}, itemObj);
                            objArr.push(Object.assign(itemObjCopy, itemObjSV));
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    }
  } else if (urlType == "Stickers") {
    const url = "/resources/data/csgo-items-db-master/schemas/sticker_kits.json";
    const response = await fetch(url);
    const data = await response.json();
    const node = document.querySelectorAll(".catalog-item-backWall");
    removeChilds(node);

    hideAllFilterOptionsExceptSticker();
    hideCatalogSortTypes("type1");
    filterHeaderName.textContent = urlType;

    for (let l = 0; l < data.list.length; l++) {
      if (stickerVariantsArray.length == 1 && stickerVariantsArray[0] == "All Variants") {
        stickerCapsulesArray.forEach((capsule) => {
          if (data.list[l].image.includes(`stickers/${capsule}/`)) {
            let itemObj = {
              itemName_Obj: data.list[l].name,
              itemWear_Obj: null,
              itemDesc_Obj: null,
              itemImageSrc_Obj: data.list[l].image,
              itemImageALtAttr_Obj: data.list[l].name,
              itemDate_added_Obj: null,
              itemCasename_Obj: null,
              itemCaseimageSrc_Obj: null,
              itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
              itemRarity_Obj: null,
              itemCase_aLink_Obj: null,
              item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                "type",
                "Stickers",
                "stickers",
                "name",
                data.list[l].name
              )}'`,
            };
            objArr.push(itemObj);
          }
        });
      } else {
        stickerVariantsArray.forEach((variant) => {
          if (data.list[l].name.includes(`(${variant})`)) {
            stickerCapsulesArray.forEach((capsule) => {
              if (data.list[l].image.includes(`stickers/${capsule}/`)) {
                let itemObj = {
                  itemName_Obj: data.list[l].name,
                  itemWear_Obj: null,
                  itemDesc_Obj: null,
                  itemImageSrc_Obj: data.list[l].image,
                  itemImageALtAttr_Obj: data.list[l].name,
                  itemDate_added_Obj: null,
                  itemCasename_Obj: null,
                  itemCaseimageSrc_Obj: null,
                  itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
                  itemRarity_Obj: null,
                  itemCase_aLink_Obj: null,
                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                    "type",
                    "Stickers",
                    "stickers",
                    "name",
                    data.list[l].name
                  )}'`,
                };
                objArr.push(itemObj);
              }
            });
          }
        });
      }
    }
  } else if (urlType == "Patches") {
    const url = "/resources/data/csgo-items-db-master/schemas/patches_kits.json";
    const response = await fetch(url);
    const data = await response.json();
    const node = document.querySelectorAll(".catalog-item-backWall");
    removeChilds(node);

    hideAllFilterOptions();
    hideCatalogSortTypes("type1");
    filterHeaderName.textContent = urlType;

    for (let l = 0; l < data.list.length; l++) {
      let itemObj = {
        itemName_Obj: data.list[l].name,
        itemWear_Obj: null,
        itemDesc_Obj: null,
        itemImageSrc_Obj: data.list[l].image,
        itemImageALtAttr_Obj: data.list[l].name,
        itemDate_added_Obj: null,
        itemCasename_Obj: null,
        itemCaseimageSrc_Obj: null,
        itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
        itemRarity_Obj: null,
        itemCase_aLink_Obj: null,
        item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
          "type",
          "Patches",
          "patches",
          "name",
          data.list[l].name
        )}'`,
      };
      objArr.push(itemObj);
    }
  } else if (urlType == "Music kits") {
    const url = "/resources/data/csgo-items-db-master/schemas/music_kits.json";
    const response = await fetch(url);
    const data = await response.json();
    const node = document.querySelectorAll(".catalog-item-backWall");
    removeChilds(node);

    hideAllFilterOptions();
    hideCatalogSortTypes("type1");
    filterHeaderName.textContent = urlType;

    for (let l = 0; l < data.list.length; l++) {
      let itemObj = {
        itemName_Obj: data.list[l].name,
        itemWear_Obj: null,
        itemDesc_Obj: null,
        itemImageSrc_Obj: data.list[l].image,
        itemImageALtAttr_Obj: data.list[l].name,
        itemDate_added_Obj: null,
        itemCasename_Obj: null,
        itemCaseimageSrc_Obj: null,
        itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
        itemRarity_Obj: null,
        itemCase_aLink_Obj: null,
        item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
          "type",
          "Music kits",
          "musickits",
          "name",
          data.list[l].name
        )}'`,
      };
      objArr.push(itemObj);
    }
  } else {
    const url = "/resources/data/csgostash-scraper-master/data/cases/json/all_cases.json";
    const response = await fetch(url);
    const data = await response.json();
    const node = document.querySelectorAll(".catalog-item-backWall");
    removeChilds(node);
    hideFilterOptionsSticker();
    for (let l = 0; l < data.list.length; l++) {
      if (urlType == "Case" || urlType == "Collection") {
        hideAllFilterOptions();
        hideCatalogSortTypes("type1");
        filterHeaderName.textContent = urlType;
        if (data.list[l].name.includes(urlType)) {
          let itemObj = {
            itemName_Obj: data.list[l].name,
            itemWear_Obj: null,
            itemDesc_Obj: null,
            itemImageSrc_Obj: data.list[l].image_url,
            itemImageALtAttr_Obj: data.list[l].name,
            itemDate_added_Obj: null,
            itemCasename_Obj: data.list[l].name,
            itemCaseimageSrc_Obj: data.list[l].image_url,
            itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
            itemRarity_Obj: null,
            itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
              "type",
              data.list[l].name.split("|")[0],
              "caseName"
            )}`,
            item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
              "type",
              "Case",
              "caseCaseName",
              "name",
              data.list[l].name
            )}'`,
          };
          if (urlType == "Case") {
            let itemObjTypeCase = {
              item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                "type",
                "Case",
                "caseCaseName",
                "name",
                data.list[l].name
              )}'`,
            };
            let itemObjCopy = Object.assign({}, itemObj);
            objArr.push(Object.assign(itemObjCopy, itemObjTypeCase));
          } else {
            let itemObjTypeCol = {
              item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                "type",
                "Collection",
                "caseCaseName",
                "name",
                data.list[l].name
              )}'`,
            };
            let itemObjCopy = Object.assign({}, itemObj);
            objArr.push(Object.assign(itemObjCopy, itemObjTypeCol));
          }
        }
      } else {
        for (let c in data.list[l].content) {
          raritysArray.forEach((rarity) => {
            if (rarity == c) {
              data.list[l].content[c].forEach((element, i) => {
                element.name = element.name.replaceAll("★ ", "");
                for (let el in element.wears) {
                  if (urlName == "null" && urlSearch == "null") {
                    filterHeaderName.textContent = urlType;

                    if (element.name.includes(urlType)) {
                      wearsArray.forEach((wear) => {
                        if (wear == el) {
                          let itemObj = {
                            itemName_Obj: element.name,
                            itemWear_Obj: el,
                            itemDesc_Obj: element.desc,
                            itemImageSrc_Obj: element.wears[el],
                            itemImageALtAttr_Obj: element.name,
                            itemDate_added_Obj: element.date_added,
                            itemCasename_Obj: data.list[l].name,
                            itemCaseimageSrc_Obj: data.list[l].image_url,
                            itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
                            itemRarity_Obj: c,
                            itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
                              "type",
                              data.list[l].name.split("|")[0],
                              "caseName"
                            )}`,
                            item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                              "type",
                              element.name.split("|")[0].trim(),
                              "marketItem",
                              "name",
                              element.name.split("|").pop("").trim(),
                              "wear",
                              el
                            )}'`,
                          };
                          objArr.push(itemObj);

                          extrasArray.forEach((ex) => {
                            if (ex == "StatTrak™") {
                              if (element.can_be_stattrak) {
                                let itemObjST = {
                                  itemName_Obj: `StatTrak™ ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "StatTrak™ " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjST));
                              }
                            }
                            if (ex == "Souvenir") {
                              if (element.can_be_souvenir) {
                                let itemObjSV = {
                                  itemName_Obj: `Souvenir ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "Souvenir " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjSV));
                              }
                            }
                          });
                        }
                      });
                    }
                  } else if (urlSearch != "null") {
                    filterHeaderName.textContent = `Search : ${urlSearch}`;
                    if (
                      element.name
                        .replace(/[^\w]/g, "")
                        .toLowerCase()
                        .includes(urlSearch.replace(/[^\w]/g, "").toLowerCase())
                    ) {
                      wearsArray.forEach((wear) => {
                        if (wear == el) {
                          let itemObj = {
                            itemName_Obj: element.name,
                            itemWear_Obj: el,
                            itemDesc_Obj: element.desc,
                            itemImageSrc_Obj: element.wears[el],
                            itemImageALtAttr_Obj: element.name,
                            itemDate_added_Obj: element.date_added,
                            itemCasename_Obj: data.list[l].name,
                            itemCaseimageSrc_Obj: data.list[l].image_url,
                            itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
                            itemRarity_Obj: c,
                            itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
                              "type",
                              data.list[l].name.split("|")[0],
                              "caseName"
                            )}`,
                            item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                              "type",
                              element.name.split("|")[0].trim(),
                              "marketItem",
                              "name",
                              element.name.split("|").pop("").trim(),
                              "wear",
                              el
                            )}'`,
                          };

                          objArr.push(itemObj);

                          extrasArray.forEach((ex) => {
                            if (ex == "StatTrak™") {
                              if (element.can_be_stattrak) {
                                let itemObjST = {
                                  itemName_Obj: `StatTrak™ ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "StatTrak™ " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjST));
                              }
                            }
                            if (ex == "Souvenir") {
                              if (element.can_be_souvenir) {
                                let itemObjSV = {
                                  itemName_Obj: `Souvenir ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "Souvenir " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjSV));
                              }
                            }
                          });
                        }
                      });
                    }
                  } else {
                    filterHeaderName.textContent = urlFullName;
                    if (element.name == urlFullName) {
                      wearsArray.forEach((wear) => {
                        if (wear == el) {
                          let itemObj = {
                            itemName_Obj: element.name,
                            itemWear_Obj: el,
                            itemDesc_Obj: element.desc,
                            itemImageSrc_Obj: element.wears[el],
                            itemImageALtAttr_Obj: element.name,
                            itemDate_added_Obj: element.date_added,
                            itemCasename_Obj: data.list[l].name,
                            itemCaseimageSrc_Obj: data.list[l].image_url,
                            itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
                            itemRarity_Obj: c,
                            itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
                              "type",
                              data.list[l].name.split("|")[0],
                              "caseName"
                            )}`,
                            item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                              "type",
                              element.name.split("|")[0].trim(),
                              "marketItem",
                              "name",
                              element.name.split("|").pop("").trim(),
                              "wear",
                              el
                            )}'`,
                          };

                          objArr.push(itemObj);

                          extrasArray.forEach((ex) => {
                            if (ex == "StatTrak™") {
                              if (element.can_be_stattrak) {
                                let itemObjST = {
                                  itemName_Obj: `StatTrak™ ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "StatTrak™ " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjST));
                              }
                            }
                            if (ex == "Souvenir") {
                              if (element.can_be_souvenir) {
                                let itemObjSV = {
                                  itemName_Obj: `Souvenir ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "Souvenir " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjSV));
                              }
                            }
                          });
                        }
                      });
                    }
                  }
                  if (urlType.includes("Case") || urlType.includes("Collection")) {
                    document.querySelector(".filter-header-name").textContent = urlType;
                    if (data.list[l].name == urlType) {
                      wearsArray.forEach((wear) => {
                        if (wear == el) {
                          let itemObj = {
                            itemName_Obj: element.name,
                            itemWear_Obj: el,
                            itemDesc_Obj: element.desc,
                            itemImageSrc_Obj: element.wears[el],
                            itemImageALtAttr_Obj: element.name,
                            itemDate_added_Obj: element.date_added,
                            itemCasename_Obj: data.list[l].name,
                            itemCaseimageSrc_Obj: data.list[l].image_url,
                            itemPrice_Obj: `${getRandomPrice(10, 140)} USD`,
                            itemRarity_Obj: c,
                            itemCase_aLink_Obj: `market.html?${mainSearchParamfunction(
                              "type",
                              data.list[l].name.split("|")[0],
                              "caseName"
                            )}`,
                            item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                              "type",
                              element.name.split("|")[0].trim(),
                              "marketItem",
                              "name",
                              element.name.split("|").pop("").trim(),
                              "wear",
                              el
                            )}'`,
                          };

                          objArr.push(itemObj);
                          extrasArray.forEach((ex) => {
                            if (ex == "StatTrak™") {
                              if (element.can_be_stattrak) {
                                let itemObjST = {
                                  itemName_Obj: `StatTrak™ ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "StatTrak™ " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjST));
                              }
                            }
                            if (ex == "Souvenir") {
                              if (element.can_be_souvenir) {
                                let itemObjSV = {
                                  itemName_Obj: `Souvenir ${element.name}`,
                                  item_aLink_Obj: `window.location.href='item.html?${mainSearchParamfunction(
                                    "type",
                                    "Souvenir " + element.name.split("|")[0].trim(),
                                    "marketItem",
                                    "name",
                                    element.name.split("|").pop("").trim(),
                                    "wear",
                                    el
                                  )}'`,
                                };
                                let itemObjCopy = Object.assign({}, itemObj);
                                objArr.push(Object.assign(itemObjCopy, itemObjSV));
                              }
                            }
                          });
                        }
                      });
                    }
                  }
                }
              });
            }
          });
        }
      }
    }
  }

  const skeletonItems = document.querySelectorAll(".catalog-item-skeleton");
  removeChilds(skeletonItems);
  startPos = 0;
  endPos = 20;
  displayCatalogObjectedItems(objArr, startPos, endPos);
}

let startPos = 20;
let endPos = 40;

const displayCatalogObjectedItems = (array, startPos, endPos) => {
  const newParams = new URLSearchParams(window.location.search);
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");
  if (array.length == 0) {
    document.querySelector(".catalog-items-alert").classList.add("flex");
    document.querySelector(".itemValue").textContent = "0 Items";
    return;
  }
  if (endPos > array.length) {
    endPos = array.length;
  }
  for (let i = startPos; i < endPos; i++) {
    const item = dataItemTemplate.content.cloneNode(true).children[0];

    const itemName = item.querySelector("[data-item-name]");
    const itemWear = item.querySelector("[data-item-wear]");
    const itemDesc = item.querySelector("[data-item-desc]");
    const itemImage = item.querySelector("[data-item-image]");
    const itemDate_added = item.querySelector("[data-item-date_added]");
    const itemCasename = item.querySelector("[data-item-casename]");
    const itemCaseimage = item.querySelector("[data-item-caseimage]");
    const itemPrice = item.querySelector("[data-item-price]");
    const itemRarity = item.querySelector("[data-item-rarity]");
    const itemCase_aLink = item.querySelector("[data-item-a_Link]");

    if (array[i].itemName_Obj.startsWith("StatTrak™")) {
      itemName.style.color = "#cf6a32";
    }
    if (array[i].itemName_Obj.startsWith("Souvenir")) {
      itemName.style.color = "#ffdb44";
    }
    itemName.textContent = array[i].itemName_Obj;
    itemName.setAttribute("title", array[i].itemName_Obj);
    itemWear.textContent = array[i].itemWear_Obj;
    itemDesc.textContent = array[i].itemDesc_Obj;
    itemImage.src = array[i].itemImageSrc_Obj;
    itemImage.setAttribute("alt", array[i].itemImageALtAttr_Obj);
    itemDate_added.textContent = array[i].itemDate_added_Obj;
    itemCasename.textContent = array[i].itemCasename_Obj;
    itemCaseimage.src = array[i].itemCaseimageSrc_Obj;
    itemPrice.textContent = array[i].itemPrice_Obj;
    itemRarity.style.cssText = `border-color : ${getCurrentRarityColor(array[i].itemRarity_Obj)} #2f3233`;
    itemCase_aLink.href = array[i].itemCase_aLink_Obj;
    item.querySelector("[data-catalog-item]").setAttribute("onclick", array[i].item_aLink_Obj);

    if (urlType == "Stickers" || urlType == "Patches" || urlType == "Music kits") {
      item.querySelector(".catalog-item-info a").remove();
    }

    dataItemsContainer.append(item);

    const sortSpan = document.querySelector(".sort-span");
    if (
      sortSpan.innerHTML == "date added : newest to oldest" ||
      sortSpan.innerHTML == "date added : oldest to newest"
    ) {
      document.querySelectorAll(".invisible").forEach((date) => {
        date.classList.remove("invisible");
      });
    }

    const catalogItem = document.querySelectorAll(".catalog-item-backWall");
    opacityFunc(catalogItem, startPos);
    item.classList.add("displayed");
  }

  countMarketItems(array);

  setCatalogItemQuantity();
  setCatalogItemFavValue();

  document.querySelectorAll(".backWall-footer-favourite-btn").forEach((btn) => {
    btn.addEventListener("mouseover", (e) => {
      if (btn.classList.contains("inFav")) {
        e.target
          .closest(".backWall-footer-favourite-btn")
          .children[0].setAttribute("name", "heart-dislike-circle-outline");
      }
    });
    btn.addEventListener("mouseout", (e) => {
      e.target.closest(".backWall-footer-favourite-btn").children[0].setAttribute("name", "heart-circle-outline");
    });
  });
};

const getCurrentRarityColor = (rarity) => {
  switch (rarity) {
    case "Rare Special Items":
      return "#e4ae39";
    case "Covert Skins":
      return "#eb4b4b";
    case "Classified Skins":
      return "#d32ce6";
    case "Restricted Skins":
      return "#8847ff";
    case "Mil-Spec Skins":
      return "#4b69ff";
    case "Industrial Grade Skins":
      return "#5e98d9";
    case "Consumer Grade Skins":
      return "#b0c3d9";
  }
};
const infiniteScroll = () => {
  window.addEventListener("scroll", () => {
    let container = document.querySelector(".catalog-items-container");
    let containerHeight = container.clientHeight - 100;

    if (window.scrollY + window.innerHeight >= containerHeight) {
      startPos += 20;
      endPos += 20;
      if (active) {
        displayCatalogObjectedItems(catalogItemsObjArr, startPos, endPos);
      } else {
        displayCatalogObjectedItems(objArr, startPos, endPos);
      }
    }
  });
};
if (document.body.id == "market") {
  infiniteScroll();
}
let active = false;

const closeCatalogSearchLabel = () => {
  const catalogSortSearchInput = document.querySelector(".catalog-sort-search-input");
  catalogSortSearchInput.value = "";
  catalogSortSearchInput.classList.remove("b");

  catalogSortSearchBtn.querySelector("ion-icon").style.fontSize = "18px";
  catalogSortSearchBtn.querySelector("ion-icon").setAttribute("name", "search-outline");

  catalogSortSearchInput.classList.add("n");
  catalogSortSearchInput.style.transform = "scaleX(0)";

  active = false;
};

const catalogSortSearchBtn = document.querySelector(".catalog-sort-search-button");
catalogSortSearchBtn &&
  catalogSortSearchBtn.addEventListener("click", () => {
    const catalogSortSearchInput = document.querySelector(".catalog-sort-search-input");
    if (catalogSortSearchInput.classList.contains("b")) {
      const sortSpan = document.querySelector(".sort-span");
      sortSpan.textContent = "not sorted";

      closeCatalogSearchLabel();

      const node = document.querySelectorAll(".catalog-item-backWall");
      removeChilds(node);

      startPos = 0;
      endPos = 20;
      displayCatalogObjectedItems(objArr, startPos, endPos);
    } else {
      catalogSortSearchInput.classList.remove("n");
      catalogSortSearchInput.focus();

      catalogSortSearchBtn.querySelector("ion-icon").style.fontSize = "20px";
      catalogSortSearchBtn.querySelector("ion-icon").setAttribute("name", "close-outline");

      catalogSortSearchInput.classList.add("b");
      catalogSortSearchInput.style.transform = "scaleX(1)";
    }
  });
let catalogItemsObjArr = [];
const catalogSearchInput = document.querySelector("[data-catalog-search]");
catalogSearchInput &&
  catalogSearchInput.addEventListener("input", (e) => {
    active = true;
    let value = e.target.value.toLowerCase();
    if (value.length < 3) {
      const node = document.querySelectorAll(".catalog-item-backWall");
      removeChilds(node);
      active = false;
      displayCatalogObjectedItems(objArr, startPos, endPos);
    } else if (value.length > 2) {
      const node = document.querySelectorAll(".catalog-item-backWall");
      removeChilds(node);
      catalogItemsObjArr = [];
      for (let i = 0; i < objArr.length; i++) {
        if (objArr[i].itemName_Obj.toLowerCase().includes(value)) {
          catalogItemsObjArr.push(objArr[i]);
        }
      }
      displayCatalogObjectedItems(catalogItemsObjArr, startPos, endPos);
    }
  });

window.addEventListener("click", (e) => {
  if (e.target.closest(".backWall-footer-basket-btn")) {
    addItemToBasketClicked(e);
  } else if (e.target.closest(".backWall-footer-favourite-btn")) {
    addItemToFavouriteClicked(e);
  }
});
/// OVERFLOW MENU ITEMS

const skeletonCatalog = () => {
  const html = `<div class="catalog-item-skeleton">
    <div class="catalog-item-image skeleton">
    </div>
    <div class="catalog-item-info">
      <span class="name skeleton"></span>
      <span class="wear skeleton"></span>
      <span class="case skeleton"></span>
      <p class="desc skeleton"></p>
      <p class="desc skeleton"></p>
      <p class="desc skeleton" style="width: 75%"></p>
      <span class="price skeleton"></span>
    </div>
</div>`;
  for (let i = 0; i < 12; i++) {
    catalogItemsContainer.insertAdjacentHTML("afterbegin", html);
  }
};

const headerOverflownBtn = document.querySelector(".header-overflown-btn");

const headerOverflownContainer = document.querySelector(".header-overflown-container");
const filterHeaderName = document.querySelector(".filter-header-name");

const showHeaderLastItemObserver = new ResizeObserver((entries) => {
  let headerMenuListWidth = headerMenuList.offsetWidth;
  let headerMenuWidth = headerMenu.offsetWidth;
  let availableSpace = headerMenuWidth - headerMenuListWidth - 200;

  const lastItem = document.querySelector(".overflown:last-child");

  if (lastItem && lastItem.offsetWidth <= availableSpace) {
    lastItem.classList.remove("overflown");
    lastItem.classList.add("notOverflown");
    headerMenuList.append(lastItem);

    hideHeaderLastItemObserver.observe(document.querySelector(".notOverflown:last-child"));
  }
});
showHeaderLastItemObserver.observe(headerMenu);

const hideHeaderLastItemObserver = new IntersectionObserver(
  (entries) => {
    const lastItem = entries[0];
    if (!lastItem.isIntersecting) {
      lastItem.target.classList.remove("notOverflown");
      lastItem.target.classList.add("overflown");
      headerOverflownContainer.append(lastItem.target);
      hideHeaderLastItemObserver.unobserve(lastItem.target);

      hideHeaderLastItemObserver.observe(document.querySelector(".notOverflown:last-child"));
    }
  },
  {
    root: document.querySelector(".header-menu"),
    threshold: 0.88,
  }
);
hideHeaderLastItemObserver.observe(document.querySelector(".notOverflown:last-child"));

const displayOverflownContainer = () => {
  window.addEventListener("click", (e) => {
    const isOverflownBtn = e.target.closest(".header-overflown-btn");
    const ioniconOverflown = document.querySelector(".overflownIcon");
    if (isOverflownBtn) {
      headerOverflownContainer.classList.toggle("isVisible");
      let ionAttr = ioniconOverflown.getAttribute("name");
      ionAttr.startsWith("caret-up")
        ? ioniconOverflown.setAttribute("name", "caret-down-outline")
        : ioniconOverflown.setAttribute("name", "caret-up-outline");
    } else {
      headerOverflownContainer.classList.remove("isVisible");
      ioniconOverflown.setAttribute("name", "caret-down-outline");
    }
  });
};
displayOverflownContainer();

//////////////////////////// I T E M . H T M L

const dataInfoContainerTemplate = document.querySelector("[data-infoContainer-template]");
const dataWearsContainerTemplate = document.querySelector("[data-wearsContainer-template]");
const dataInfoContainer = document.querySelector("[data-rightside-container]");
const dataWearsContainer = document.querySelector("[data-item-wears-container]");
const dataCaseContentTemplate = document.querySelector("[data-case-content-template]");
const dataCaseContentContainer = document.querySelector("[data-case-content-container]");
const itemWearsContainer = document.querySelector(".item-wears-container");
const caseContentContainer = document.querySelector(".case-content-container");
const buttonsContent = document.querySelectorAll(".content-wrapper");

async function getCatalogItem() {
  const newParams = new URLSearchParams(window.location.search);

  let urlType = newParams.get("type").replaceAll("★ ", "").trim();
  let urlName = newParams.get("name").replaceAll("★ ", "").trim();
  let urlWear = `${newParams.get("wear")}`;

  let stattrakValue = false;
  let souvenirValue = false;

  if (urlType.startsWith("StatTrak™")) {
    stattrakValue = true;
    urlType = urlType.replace("StatTrak™", "").trim();
  }
  if (urlType.startsWith("Souvenir") && !urlName.includes("Package")) {
    souvenirValue = true;
    urlType = urlType.replace("Souvenir", "").trim();
  }

  let urlFullName = `${urlType} | ${urlName}`;

  const node1 = document.querySelectorAll(".catalog-sort-step");
  removeChilds(node1);
  catalogSortSteps.style.paddingLeft = "0";
  if (urlType != "null") {
    const html = `<div class="catalog-sort-step">
    <a href="market.html?${mainSearchParamfunction("type", urlType, "subcatCategory")}">
      ${urlType}
      <ion-icon name="chevron-forward-sharp"></ion-icon>
    </a>
  </div>`;
    catalogSortSteps.insertAdjacentHTML("beforeend", html);
  }
  if (urlName != "null") {
    const html = `<div class="catalog-sort-step">
        <a href="market.html?${mainSearchParamfunction("type", urlType, "hovercatCategory", "name", urlName)}">
          ${urlName}
          <ion-icon name="chevron-forward-sharp"></ion-icon>
        </a>
      </div>`;

    catalogSortSteps.insertAdjacentHTML("beforeend", html);
  }
  if (urlWear != "null") {
    const html = `<div class="catalog-sort-step">
    <a href="item.html?${mainSearchParamfunction("type", urlType, "marketItem", "name", urlName, "wear", urlWear)}">
      ${urlWear}
      <ion-icon name="chevron-forward-sharp"></ion-icon>
    </a>
  </div>`;
    catalogSortSteps.insertAdjacentHTML("beforeend", html);
  }
  catalogSortSteps.lastElementChild.querySelector("a").removeAttribute("href");
  catalogSortSteps.lastElementChild.querySelector("a").style.color = "#fa3719";

  catalogSortSteps.lastChild.querySelector("ion-icon").remove();

  if (
    !urlFullName.includes("Souvenir") &&
    !urlFullName.includes("Package") &&
    !urlFullName.includes("Stickers") &&
    !urlFullName.includes("Patches") &&
    !urlFullName.includes("Music kits")
  ) {
    const url = "/resources/data/csgostash-scraper-master/data/cases/json/all_cases.json";
    const response = await fetch(url);
    const data = await response.json();

    let v = 0;
    let f = 0;
    for (let l = 0; l < data.list.length; l++) {
      if (f == 0) {
        for (let c in data.list[l].content) {
          data.list[l].content[c].forEach((element, i) => {
            element.name = element.name.replaceAll("★ ", "");
            for (let el in element.wears) {
              const infoContent = dataInfoContainerTemplate.content.cloneNode(true);
              const wearContent = dataWearsContainerTemplate.content.cloneNode(true);

              const itemWear = infoContent.querySelector("[data-item-wear]");
              const itemName = infoContent.querySelector("[data-item-name]");
              const itemDesc = infoContent.querySelector("[data-item-desc]");
              const itemLore = infoContent.querySelector("[data-item-lore]");
              const itemCaseimage = infoContent.querySelector("[data-item-caseImage]");
              const itemCaseName = infoContent.querySelector("[data-item-caseName]");
              const itemDate = infoContent.querySelector("[data-item-date]");
              const itemPrice = infoContent.querySelector("[data-item-price]");
              const itemWearImage = wearContent.querySelector("[data-item-wear-image]");
              const itemWearWear = wearContent.querySelector("[data-item-wear-wear]");
              const itemWear_aLink = wearContent.querySelector("[data-item-wear-aLink]");
              const itemCase_aLink = infoContent.querySelector("[data-item-info-aLink]");

              if (element.name == urlFullName) {
                f++;
                itemWearsContainer.classList.add("flex");
                itemWearImage.src = element.wears[el];
                itemWearImage.setAttribute("alt", element.name);
                itemWearImage.setAttribute("title", el);
                itemWearWear.textContent = el;
                itemWear_aLink.href = `item.html?${mainSearchParamfunction(
                  "type",
                  element.name.split("|")[0].trim(),
                  "wearsItem",
                  "wear",
                  el.trim()
                )}`;
                dataWearsContainer.prepend(wearContent.cloneNode(true));

                if (element.can_be_stattrak) {
                  itemWearWear.textContent = `StatTrak™ ${el}`;
                  itemWearWear.style.color = "#cf6a32";
                  itemWearImage.setAttribute("title", `StatTrak™ ${el}`);
                  itemWearImage.setAttribute("alt", `StatTrak™ ${element.name}`);
                  itemWear_aLink.href = `item.html?${mainSearchParamfunction(
                    "type",
                    "StatTrak™ " + element.name.split("|")[0].trim(),
                    "wearsItem",
                    "wear",
                    el.trim()
                  )}`;
                  dataWearsContainer.append(wearContent);
                }
                if (element.can_be_souvenir) {
                  itemWearWear.textContent = `Souvenir ${el}`;
                  itemWearWear.style.color = "#ffdb44";
                  itemWearImage.setAttribute("title", `Souvenir ${el}`);
                  itemWearImage.setAttribute("alt", `Souvenir ${element.name}`);
                  itemWear_aLink.href = `item.html?${mainSearchParamfunction(
                    "type",
                    "Souvenir " + element.name.split("|")[0].trim(),
                    "wearsItem",
                    "wear",
                    el.trim()
                  )}`;
                  dataWearsContainer.append(wearContent);
                }
                if (el == urlWear) {
                  const itemWears = document.querySelectorAll(".item-wear");
                  itemWears.forEach((wear) => {
                    if (stattrakValue || souvenirValue) {
                      if (wear.innerText == `StatTrak™ ${urlWear}` || wear.innerText == `Souvenir ${urlWear}`) {
                        wear.style.backgroundColor = "#232728";
                        wear.lastElementChild.style.color = "#fa3719";
                        wear.style.borderBottom = "1px solid #fa3719";
                        wear.parentElement.removeAttribute("href");
                      }
                    } else {
                      if (wear.innerText == urlWear) {
                        wear.style.backgroundColor = "#232728";
                        wear.lastElementChild.style.color = "#fa3719";
                        wear.style.borderBottom = "1px solid #fa3719";
                        wear.parentElement.removeAttribute("href");
                      }
                    }
                  });
                }
              }
              if (element.name == urlFullName && el == urlWear) {
                if (v == 0) {
                  v++;
                  const html = `<img class="item-image" src="${element.wears[urlWear]}" alt="${element.name}" title="${element.name}" data-item-image>`;
                  document.querySelector(".item-image-container").insertAdjacentHTML("beforeend", html);

                  if (stattrakValue == true) {
                    itemName.textContent = `StatTrak™ ${element.name}`;
                    itemName.style.color = "#cf6a32";
                  } else if (souvenirValue == true) {
                    itemName.textContent = `Souvenir ${element.name}`;
                    itemName.style.color = "#ffdb44";
                  } else {
                    itemName.textContent = element.name;
                  }
                  itemWear.textContent = el;
                  itemDesc.textContent = element.desc;
                  itemLore.textContent = element.lore;
                  itemCaseimage.src = data.list[l].image_url;
                  itemCaseimage.setAttribute("alt", data.list[l].name);
                  itemCaseName.textContent = data.list[l].name;
                  itemCase_aLink.href = `market.html?${mainSearchParamfunction(
                    "type",
                    data.list[l].name.split("|")[0],
                    "caseName"
                  )}`;
                  itemDate.textContent = element.date_added;
                  itemPrice.textContent = `${getRandomPrice(10, 150)} USD`;

                  dataInfoContainer.append(infoContent);
                }
              } else if (data.list[l].name == urlName) {
                if (v == 0) {
                  v++;
                  const html = `<img class="item-image" src="${data.list[l].image_url}" alt="${data.list[l].name}" title="${data.list[l].name}" data-item-image>`;

                  document.querySelector(".item-image-container").insertAdjacentHTML("beforeend", html);

                  itemName.textContent = data.list[l].name;
                  itemCaseimage.src = data.list[l].image_url;
                  itemCaseimage.setAttribute("alt", data.list[l].name);
                  itemCaseName.textContent = data.list[l].name;
                  itemPrice.textContent = `${getRandomPrice(50, 500)} USD`;
                  itemDate.textContent = "none";
                  itemCase_aLink.href = `market.html?${mainSearchParamfunction(
                    "type",
                    data.list[l].name.split("|")[0],
                    "caseName"
                  )}`;
                  dataInfoContainer.append(infoContent);
                }
              }
            }
          });
        }
      }
      for (let c in data.list[l].content) {
        data.list[l].content[c].forEach((element, i) => {
          element.name = element.name.replaceAll("★ ", "");
          if (element.name.startsWith(urlType)) {
            const dataCurrentItemCatalogItemsContainer = document.querySelector(
              "[data-currentItem-catalog-items-container]"
            );
            const dataCurrentItemTemplate = document.querySelector("[data-currentItem-item-template]");
            const item = dataCurrentItemTemplate.content.cloneNode(true).children[0];

            const itemName = item.querySelector("[data-currentItem-item-name]");
            const itemWear = item.querySelector("[data-currentItem-item-wear]");
            const itemDesc = item.querySelector("[data-currentItem-item-desc]");
            const itemImage = item.querySelector("[data-currentItem-item-image]");
            const itemCasename = item.querySelector("[data-currentItem-item-casename]");
            const itemCaseimage = item.querySelector("[data-currentItem-item-caseimage]");
            const itemPrice = item.querySelector("[data-currentItem-item-price]");
            const itemRarity = item.querySelector("[data-currentItem-item-rarity]");
            const itemCase_aLink = item.querySelector("[data-currentItem-item-a_Link]");
            for (let el in element.wears) {
              if (urlFullName != element.name) {
                itemName.textContent = element.name;
                itemName.setAttribute("title", element.name);
                itemWear.textContent = el;
                itemDesc.textContent = element.desc;
                itemImage.src = element.wears[el];
                itemImage.setAttribute("alt", element.name);
                itemCasename.textContent = data.list[l].name;
                itemCaseimage.src = data.list[l].image_url;
                itemPrice.textContent = `${getRandomPrice(10, 150)} USD`;
                itemRarity.style.cssText = `border-color : ${getCurrentRarityColor(c)} #2f3233`;
                itemCase_aLink.href = `market.html?${mainSearchParamfunction(
                  "type",
                  data.list[l].name.split("|")[0],
                  "caseName"
                )}`;
                item
                  .querySelector("[data-currentItem-catalog-item]")
                  .setAttribute(
                    "onclick",
                    `window.location.href='market.html?${mainSearchParamfunction(
                      "type",
                      element.name.split("|")[0].trim(),
                      "currentItemCatalog",
                      "name",
                      element.name.split("|").pop("").trim()
                    )}'`
                  );
                dataCurrentItemCatalogItemsContainer.append(item);
                break;
              }
            }
          }
        });
        const catalogItem = document.querySelectorAll(".catalog-item-backWall");
        opacityFunc(catalogItem, startPos);
      }
    }
  } else {
    let v = 0;
    if (urlType == "Souvenir") {
      const url = "/resources/data/csgostash-scraper-master/data/souvenir_packages/json/all_souvenirPackages.json";
      const response = await fetch(url);
      const data = await response.json();

      for (let l = 0; l < data.list.length; l++) {
        const infoContent = dataInfoContainerTemplate.content.cloneNode(true);

        const itemName = infoContent.querySelector("[data-item-name]");
        const itemCaseimage = infoContent.querySelector("[data-item-caseImage]");
        const itemCaseName = infoContent.querySelector("[data-item-casename]");
        const itemPrice = infoContent.querySelector("[data-item-price]");
        const itemCase_aLink = infoContent.querySelector("[data-item-info-aLink]");

        if (data.list[l].name == urlName) {
          if (v == 0) {
            v++;
            const html = `<img class="item-image" src="${data.list[l].image_url}" alt="${data.list[l].name}" title="${data.list[l].name}" data-item-image>`;

            document.querySelector(".item-image-container").insertAdjacentHTML("beforeend", html);

            itemName.textContent = data.list[l].name;
            itemCaseimage.src = data.list[l].image_url;
            itemCaseimage.setAttribute("alt", data.list[l].name);
            itemCaseName.textContent = data.list[l].name;
            itemPrice.textContent = `${getRandomPrice(0.1, 10)} USD`;
            itemCase_aLink.href = `market.html?${mainSearchParamfunction(
              "type",
              data.list[l].name.split("|")[0],
              "caseName"
            )}`;

            dataInfoContainer.append(infoContent);
            item.querySelector(".item-data").style.display = "none";
          }
        }
      }
    } else {
      let url;
      if (urlType == "Stickers") {
        url = "/resources/data/csgo-items-db-master/schemas/sticker_kits.json";
      } else if (urlType == "Patches") {
        url = "/resources/data/csgo-items-db-master/schemas/patches_kits.json";
      } else if (urlType == "Music kits") {
        url = "/resources/data/csgo-items-db-master/schemas/music_kits.json";
      }
      const response = await fetch(url);
      const data = await response.json();

      for (let l = 0; l < data.list.length; l++) {
        const infoContent = dataInfoContainerTemplate.content.cloneNode(true);

        const itemName = infoContent.querySelector("[data-item-name]");
        const itemCaseName = infoContent.querySelector("[data-item-casename]");
        const itemCase_aLink = infoContent.querySelector("[data-item-info-aLink]");
        const itemPrice = infoContent.querySelector("[data-item-price]");

        if (data.list[l].name == urlName) {
          const html = `<img class="item-image" src="${data.list[l].image}" alt="${data.list[l].name}" title="${data.list[l].name}" data-item-image>`;
          document.querySelector(".item-image-container").insertAdjacentHTML("beforeend", html);

          itemName.textContent = data.list[l].name;
          itemPrice.textContent = `${getRandomPrice(10, 150)} USD`;
          let capsuleName = data.list[l].image.split("/stickers/").pop("").split("/")[0];
          itemCaseName.textContent = capsuleName.replace("_", " ");
          itemCaseName.value = capsuleName;
          itemCase_aLink.href = `market.html?type=${urlType}`;

          dataInfoContainer.append(infoContent);

          item.querySelector(".lore-info").style.display = "none";
          item.querySelector(".item-data").style.display = "none";
        }
      }
    }
  }

  const UrlTypes = ["Souvenir", "Package", "Collection", "Stickers", "Patches", "Music kits"];
  UrlTypes.forEach((type) => {
    if (urlType == type) {
      document.querySelector(".currentItem-catalog-items").style.display = "none";
      document.querySelector(".item-info-a").style.display = "none";
    }
  });
  if (urlType == "Case") document.querySelector(".currentItem-catalog-items").style.display = "none";

  addRemoveBasketClickedItemPage();
  displayItemQuantityAlert();
  setCatalogItemFavValue();
}

const currentItemCatalogItemsContainer = document.querySelector(".currentItem-catalog-items-container");
const scrollCurrentItemCatalogContainer = (e) => {
  if (e.target.closest("#currentItem-catalog-buttonWrapper-next")) {
    currentItemCatalogItemsContainer.scrollLeft += currentItemCatalogItemsContainer.clientWidth - 100;
  } else if (e.target.closest("#currentItem-catalog-buttonWrapper-prev")) {
    currentItemCatalogItemsContainer.scrollLeft -= currentItemCatalogItemsContainer.clientWidth - 100;
  }
};

const currentItemCatalogWrapperBtns = document.querySelectorAll(".currentItem-catalog-buttonWrapper");
currentItemCatalogWrapperBtns.forEach((btn) => {
  btn.addEventListener("click", scrollCurrentItemCatalogContainer);
});

const displayItemQuantityAlert = () => {
  let name = document.querySelector(".item-info-name").textContent;
  let wear = document.querySelector(".item-info-wear").textContent;

  const newParams = new URLSearchParams(window.location.search);
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");

  if (urlType == "Stickers") {
    name = `${document.querySelector(".item-info-name").textContent.split("|").pop("").trim()}${document
      .querySelector(".item-info-name")
      .textContent.split("|")[0]
      .trim()}`;
  }

  let stringId = `${name}${wear}`.replaceAll(" ", "").replaceAll("|", "");
  if (localStorage[stringId]) {
    document.querySelector(".item-quantity-alert").style.visibility = "visible";
    document.querySelector(".item-addToBasket-btn").textContent = "in basket";

    document.querySelector(".item-addToBasket-btn").classList.remove("notinbasket");
    document.querySelector(".item-addToBasket-btn").classList.add("inbasket");
  } else {
    document.querySelector(".item-quantity-alert").style.visibility = "hidden";
    document.querySelector(".item-addToBasket-btn").textContent = "add to basket";

    document.querySelector(".item-addToBasket-btn").classList.remove("inbasket");
    document.querySelector(".item-addToBasket-btn").classList.add("notinbasket");
  }
  if (localStorage[`fav.${stringId}`]) {
    document.querySelector(".item-favourite-alert").style.visibility = "visible";
  } else {
    document.querySelector(".item-favourite-alert").style.visibility = "hidden";
  }
};

const scrollValueContent = (e) => {
  if (e.target.closest("#content-wrapper-next")) {
    caseContentContainer.scrollLeft += caseContentContainer.clientWidth - 20;
  } else if (e.target.closest("#content-wrapper-back")) {
    caseContentContainer.scrollLeft -= caseContentContainer.clientWidth - 20;
  }
};
buttonsContent.forEach((btn) => {
  btn.addEventListener("click", scrollValueContent);
});
///// observer
const slideItems = document.querySelectorAll(".midcontainer");

const slideObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("slide-item", entry.isIntersecting);
      if (entry.isIntersecting) {
        slideObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5,
  }
);
slideItems.forEach((item) => {
  slideObserver.observe(item);
});
///IMAGE CONTAINER

const backgroundsArray = [
  "/resources/img/777823.jpg",
  "/resources/img/775776.jpg",
  "/resources/img/811970.jpg",
  "/resources/img/766890.jpg",
];
const imageContainerH1textArray = [
  "Buy CS:GO skins and items cheaper.",
  "SnakeBite Case.",
  "Connect with us.",
  "The universe of skins.",
];
const imageContainerSpantextArray = [
  "We offer the cheapest skins on the market.",
  "Discover the new CS:GO skins from SnakeBite Case.",
  "Follow us for news, giveaways and much more.",
  "Discover by yourself.",
];

let ind = 0;

const imageBackground = document.querySelector(".image-background");
const imageContainer = document.querySelector(".image-container");
const imageContainerMainSpan = document.querySelector(".image-container span:first-child");
const imageContainerSpan = document.querySelector(".image-container span:last-child");
const imageContainerBtns = document.querySelectorAll(".image-container-btn");

const changeImageContainerItems = (e) => {
  if (typeof e != "undefined") {
    if (e.target.closest("[data-image-container-btn-next]")) {
      ind++;
      if (ind >= backgroundsArray.length) {
        ind = 0;
      }
    } else if (e.target.closest("[data-image-container-btn-prev]")) {
      ind--;
      if (ind < 0) {
        ind = backgroundsArray.length - 1;
      }
    }
  }
  if (typeof e == "undefined") {
    ind++;
    if (ind >= backgroundsArray.length) {
      ind = 0;
    } else if (ind <= 0) {
      ind = backgroundsArray.length;
    }
  }
  imageBackground.style.opacity = "0";
  imageBackground.style.animationName = "none";

  imageContainerMainSpan.style.cssText = "transform: translateX(150px); opacity: 0; visibility: hidden;";
  imageContainerSpan.style.cssText = "transform: translateX(-150px); opacity: 0; visibility: hidden;";
  setTimeout(() => {
    imageContainerMainSpan.style.cssText = "transform: translateX(0px);opacity: 1;  visibility: visible;";
    imageContainerSpan.style.cssText = "transform: translateX(150px);opacity: 1;  visibility: visible;";
  }, 500);
  imageContainerSpan.textContent = imageContainerSpantextArray[ind];
  imageContainerMainSpan.textContent = imageContainerH1textArray[ind];
  imageBackground.style.cssText = `visibility: hidden; opacity: 0; background: url(${backgroundsArray[ind]}); background-size: cover; background-position: center;`;
  setTimeout(() => {
    imageBackground.style.visibility = "visible";
    imageBackground.style.opacity = "1";
  }, 300);
  imageBackground.style.animationName = "scale-1-2";
};
if (document.body.id == "index") {
  let imageInterval = setInterval(changeImageContainerItems, 5000);

  imageContainerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearInterval(imageInterval);
      imageInterval = setInterval(changeImageContainerItems, 5000);
    });
  });
  imageContainerBtns.forEach((btn) => {
    imageBackground.style.animationName = "none";
    imageBackground.style.animationName = "scale-1-2";
    btn.addEventListener("click", changeImageContainerItems);
  });
}
// BASKET && FAVOURITE FUNCTIONS

const putItemsToLocalStorage = (stringId, image, type, name, wear, price, link) => {
  let localItem = {
    localImage: image,
    localType: type,
    localName: name,
    localWear: wear,
    localPrice: price,
    localQuantity: 1,
    localLink: link,
  };
  if (localStorage.getItem(stringId)) {
    localItem = JSON.parse(localStorage.getItem(stringId));
    localItem.localQuantity++;
    localStorage.setItem(stringId, JSON.stringify(localItem));
  } else {
    localStorage.setItem(stringId, JSON.stringify(localItem));
    addItemToBasket(stringId);
  }
  updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
  if (document.body.id == "item") {
    displayItemQuantityAlert();
  }
  setCatalogItemQuantity();
};
const putFavItemsToLocalStorage = (e, favStringId, image, type, name, wear, link) => {
  let favLocalItem = {
    localImage: image,
    localType: type,
    localName: name,
    localWear: wear,
    localLink: link,
  };
  if (localStorage.getItem(favStringId)) {
    localStorage.removeItem(favStringId);

    e.target.closest(".catalog-item-backWall").querySelector(".catalog-item-top-favourite ion-icon").style.color =
      "#686b6d";
    e.target.closest(".catalog-item-backWall").querySelector(".backWall-footer-favourite-btn ion-icon").style.color =
      "#686b6d";

    e.target
      .closest(".catalog-item-backWall")
      .querySelector(".backWall-footer-favourite-btn")
      .classList.remove("inFav");
    e.target.closest(".backWall-footer-favourite-btn").children[0].setAttribute("name", "heart-circle-outline");
  } else {
    localStorage.setItem(favStringId, JSON.stringify(favLocalItem));
    addItemToFavourite(favStringId);
    e.target.closest(".catalog-item-backWall").querySelector(".catalog-item-top-favourite ion-icon").style.color =
      "rgba(250, 25, 25, 1)";
    e.target.closest(".catalog-item-backWall").querySelector(".backWall-footer-favourite-btn ion-icon").style.color =
      "rgba(250, 25, 25, 1)";

    e.target.closest(".catalog-item-backWall").querySelector(".backWall-footer-favourite-btn").classList.add("inFav");
    e.target.closest(".backWall-footer-favourite-btn").children[0].setAttribute("name", "heart-dislike-circle-outline");
  }
  updateFavourite();
};
const addRemoveBasketClickedItemPage = () => {
  const newParams = new URLSearchParams(window.location.search);
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");

  let url = `item.html?${new URLSearchParams(window.location.search)}'`;
  const itemAddToBasketBtn = document.querySelector(".item-addToBasket-btn");
  itemAddToBasketBtn &&
    itemAddToBasketBtn.addEventListener("click", (e) => {
      let image = e.target.closest(".catalog-currentItem").querySelector(".item-image-container img").src;
      let type = e.target
        .closest(".catalog-currentItem")
        .querySelector(".item-info-name")
        .textContent.split("|")[0]
        .trim();
      let name = e.target
        .closest(".catalog-currentItem")
        .querySelector(".item-info-name")
        .textContent.split("|")
        .pop("")
        .trim();
      let wear = e.target.closest(".catalog-currentItem").querySelector(".item-info-wear").textContent;
      let price = e.target.closest(".catalog-currentItem").querySelector(".item-price").textContent;
      let link = url;
      if (type == name) {
        type = "";
      }
      if (urlType == "Stickers") {
        type = e.target
          .closest(".catalog-currentItem")
          .querySelector(".item-info-name")
          .textContent.split("|")
          .pop("")
          .trim();
        name = e.target
          .closest(".catalog-currentItem")
          .querySelector(".item-info-name")
          .textContent.split("|")[0]
          .trim();
      }
      let stringId = `${type}${name}${wear}`.replaceAll(" ", "");

      if (itemAddToBasketBtn.classList.contains("inbasket")) {
        localStorage.removeItem(stringId);
        updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
      } else if (itemAddToBasketBtn.classList.contains("notinbasket")) {
        putItemsToLocalStorage(stringId, image, type, name, wear, price, link);
      }
      displayItemQuantityAlert();
    });
  itemAddToBasketBtn &&
    itemAddToBasketBtn.addEventListener("mouseover", () => {
      if (itemAddToBasketBtn.classList.contains("inbasket")) {
        itemAddToBasketBtn.textContent = "remove";
      }
    });
  itemAddToBasketBtn.addEventListener("mouseout", () => {
    if (itemAddToBasketBtn.classList.contains("inbasket")) {
      itemAddToBasketBtn.textContent = "in basket";
    }
  });
};
const addItemToBasketClicked = (e) => {
  const newParams = new URLSearchParams(window.location.search);
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");

  let image = e.target.closest(".catalog-item-backWall").querySelector(".catalog-item-image img").src;
  let type = e.target
    .closest(".catalog-item-backWall")
    .querySelector(".catalog-item-info .name")
    .textContent.split("|")[0]
    .trim();
  let name = e.target
    .closest(".catalog-item-backWall")
    .querySelector(".catalog-item-info .name")
    .textContent.split("|")
    .pop("")
    .trim();
  let wear = e.target.closest(".catalog-item-backWall").querySelector(".catalog-item-info .wear").textContent;
  let price = e.target.closest(".catalog-item-backWall").querySelector(".catalog-item-info .price").textContent;
  let link = e.target.closest(".catalog-item-backWall").querySelector(".catalog-item").getAttribute("onclick");
  if (type == name) {
    type = "";
  }
  if (urlType == "Stickers") {
    type = e.target
      .closest(".catalog-item-backWall")
      .querySelector(".catalog-item-info .name")
      .textContent.split("|")
      .pop("")
      .trim();
    name = e.target
      .closest(".catalog-item-backWall")
      .querySelector(".catalog-item-info .name")
      .textContent.split("|")[0]
      .trim();
  }
  let stringId = `${type}${name}${wear}`.replaceAll(" ", "");
  putItemsToLocalStorage(stringId, image, type, name, wear, price, link);
};
const addItemToFavouriteClicked = (e) => {
  const newParams = new URLSearchParams(window.location.search);
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");

  let image = e.target.closest(".catalog-item-backWall").querySelector(".catalog-item-image img").src;
  let type = e.target
    .closest(".catalog-item-backWall")
    .querySelector(".catalog-item-info .name")
    .textContent.split("|")[0]
    .trim();
  let name = e.target
    .closest(".catalog-item-backWall")
    .querySelector(".catalog-item-info .name")
    .textContent.split("|")
    .pop("")
    .trim();
  let wear = e.target.closest(".catalog-item-backWall").querySelector(".catalog-item-info .wear").textContent;
  let link;
  if (window.location.href.includes("item.html?")) {
    link = `window.location.href='item.html?${mainSearchParamfunction(
      "type",
      type,
      "marketItem",
      "name",
      name,
      "wear",
      wear
    )}'`;
  } else {
    link = e.target.closest(".catalog-item-backWall").querySelector(".catalog-item").getAttribute("onclick");
  }

  if (type == name) {
    type = "";
  }
  if (urlType == "Stickers") {
    type = e.target
      .closest(".catalog-item-backWall")
      .querySelector(".catalog-item-info .name")
      .textContent.split("|")
      .pop("")
      .trim();
    name = e.target
      .closest(".catalog-item-backWall")
      .querySelector(".catalog-item-info .name")
      .textContent.split("|")[0]
      .trim();
  }
  let favStringId = `fav.${type}${name}${wear}`.replaceAll(" ", "");
  putFavItemsToLocalStorage(e, favStringId, image, type, name, wear, link);
};

const addItemToBasket = (stringId) => {
  let localItem = JSON.parse(localStorage.getItem(stringId));

  const dataAccountBasketDropdownItemTemplate = document.querySelector("[data-basket-dropdown-item-template]");
  const accountBasketDropdownItems = document.querySelector(".account-basket-dropdown-items");
  const item = dataAccountBasketDropdownItemTemplate.content.cloneNode(true);

  const itemImage = item.querySelector("[data-basket-dropdown-item-image]");
  const itemType = item.querySelector("[data-basket-dropdown-item-type]");
  const itemName = item.querySelector("[data-basket-dropdown-item-name]");
  const itemWear = item.querySelector("[data-basket-dropdown-item-wear]");
  const itemPrice = item.querySelector("[data-basket-dropdown-item-price]");
  const itemQuantity = item.querySelector(".basket-dropdown-item-input input");
  const item_aLink = item.querySelector("[data-basket-dropdown-item-a_Link]");

  itemImage.src = localItem.localImage;
  itemType.textContent = localItem.localType;
  itemName.textContent = localItem.localName;
  itemWear.textContent = localItem.localWear;
  itemPrice.textContent = localItem.localPrice;
  itemQuantity.value = localItem.localQuantity;
  item_aLink.href = localItem.localLink.replace("window.location.href='", "").slice(0, -1);

  accountBasketDropdownItems.prepend(item);
};
const addItemToFavourite = (favStringId) => {
  let favLocalItem = JSON.parse(localStorage.getItem(favStringId));

  const dataAccountFavouriteDropdownItemTemplate = document.querySelector("[data-favourite-dropdown-item-template]");
  const accountFavouriteDropdownItems = document.querySelector(".account-favourite-dropdown-items");
  const item = dataAccountFavouriteDropdownItemTemplate.content.cloneNode(true);

  const itemImage = item.querySelector("[data-favourite-dropdown-item-image]");
  const itemType = item.querySelector("[data-favourite-dropdown-item-type]");
  const itemName = item.querySelector("[data-favourite-dropdown-item-name]");
  const itemWear = item.querySelector("[data-favourite-dropdown-item-wear]");
  const item_aLink = item.querySelector("[data-favourite-dropdown-item-a_Link]");

  itemImage.src = favLocalItem.localImage;
  itemType.textContent = favLocalItem.localType;
  itemName.textContent = favLocalItem.localName;
  itemWear.textContent = favLocalItem.localWear;

  item_aLink.href = favLocalItem.localLink.replace("window.location.href='", "").slice(0, -1);

  accountFavouriteDropdownItems.prepend(item);
};
const updateBasket = (selector, itemsContainerSelector) => {
  const basketItems = document.querySelectorAll(`.${selector}`);

  basketItems.forEach((item) => {
    item.parentElement.remove();
  });

  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith("fav.")) {
      let localItem = JSON.parse(localStorage.getItem(key));

      const dataBasketItemTemplate = document.querySelector(`[data-${selector}-template]`);
      const basketItemsContainer = document.querySelector(`.${itemsContainerSelector}`);

      const item = dataBasketItemTemplate.content.cloneNode(true);
      const itemImage = item.querySelector(`[data-${selector}-image]`);
      const itemType = item.querySelector(`[data-${selector}-type]`);
      const itemName = item.querySelector(`[data-${selector}-name]`);
      const itemWear = item.querySelector(`[data-${selector}-wear]`);
      const itemPrice = item.querySelector(`[data-${selector}-price]`);
      const itemQuantity = item.querySelector(`.${selector}-input input`);
      const item_aLink = item.querySelector(`[data-${selector}-a_Link]`);

      itemImage.src = localItem.localImage;
      itemType.textContent = localItem.localType;
      itemName.textContent = localItem.localName;
      itemWear.textContent = localItem.localWear;
      itemPrice.textContent = localItem.localPrice;
      itemQuantity.value = localItem.localQuantity;
      item_aLink.href = localItem.localLink.replace("window.location.href='", "").slice(0, -1);

      basketItemsContainer.prepend(item);

      if (localItem.localType.startsWith("StatTrak")) {
        itemType.style.color = "#cf6a32";
      } else if (localItem.localType.startsWith("Souvenir")) {
        itemType.style.color = "#ffdb44";
      }
    }
  });

  countBasketItems(selector);
  countBasketItemsPrice(selector);
};
const updateFavourite = () => {
  const favouriteDropdownItems = document.querySelectorAll(".favourite-dropdown-item");

  favouriteDropdownItems.forEach((item) => {
    item.parentElement.remove();
  });

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("fav.")) {
      let favLocalItem = JSON.parse(localStorage.getItem(key));

      const dataFavouriteDropdownItemTemplate = document.querySelector("[data-favourite-dropdown-item-template]");
      const favouriteDropdownItemsContainer = document.querySelector(".account-favourite-dropdown-items");

      const item = dataFavouriteDropdownItemTemplate.content.cloneNode(true);
      const itemImage = item.querySelector("[data-favourite-dropdown-item-image]");
      const itemType = item.querySelector("[data-favourite-dropdown-item-type]");
      const itemName = item.querySelector("[data-favourite-dropdown-item-name]");
      const itemWear = item.querySelector("[data-favourite-dropdown-item-wear]");
      const item_aLink = item.querySelector("[data-favourite-dropdown-item-a_Link]");

      itemImage.src = favLocalItem.localImage;
      itemType.textContent = favLocalItem.localType;
      itemName.textContent = favLocalItem.localName;
      itemWear.textContent = favLocalItem.localWear;
      item_aLink.href = favLocalItem.localLink.replace("window.location.href='", "").slice(0, -1);

      favouriteDropdownItemsContainer.prepend(item);

      if (favLocalItem.localType.replace("fav.", "").startsWith("StatTrak")) {
        itemType.style.color = "#cf6a32";
      } else if (favLocalItem.localType.replace("fav.", "").startsWith("Souvenir")) {
        itemType.style.color = "#ffdb44";
      }
    }
  });

  countFavouriteItems();
};
const countBasketItems = (closestSelector) => {
  const basketQuantity = document.querySelector(".basket-quantity");
  if (closestSelector == "basket-item") {
    let num = document.querySelectorAll(".basket-item").length;
    const basketContainerLeftHeader = document.querySelector(".basket-container-left-header");
    const basketConfirmItemsValue = document.querySelector(".basket-confirm-itemsValue");
    basketContainerLeftHeader.textContent = `${num} ITEMS IN BASKET`;
    basketConfirmItemsValue.textContent = `${num} items`;

    basketQuantity.style.visibility = "visible";
    basketQuantity.textContent = num;
    if (basketQuantity.textContent == 0) {
      basketQuantity.style.visibility = "hidden";
    }
  } else {
    let num = document.querySelectorAll(".account-basket-dropdown-items .basket-dropdown-item").length;
    const basketDropdownHeaderLeft = document.querySelector(".basket-dropdown-header-left");
    basketDropdownHeaderLeft.textContent = `${num} ITEMS IN BASKET`;

    basketQuantity.style.visibility = "visible";
    basketQuantity.textContent = num;
    if (basketQuantity.textContent == 0) {
      basketQuantity.style.visibility = "hidden";
    }
  }
};
const countFavouriteItems = () => {
  let num = document.querySelectorAll(".account-favourite-dropdown-items .favourite-dropdown-item").length;
  const favouriteDropdownHeaderLeft = document.querySelector(".favourite-dropdown-header-left");
  favouriteDropdownHeaderLeft.textContent = `${num} ITEMS IN YOUR FAVOURITE`;
};
const countBasketItemsPrice = (closestSelector) => {
  const basketFooterTotal = document.querySelector(".basket-dropdown-footer-right-total");
  const basketItemInfoRight = document.querySelectorAll(`.${closestSelector}-info-right`);
  const basketTotalSpan = document.querySelector(".basket-total-span");
  let sum = 0;
  basketItemInfoRight.forEach((item) => {
    sum +=
      parseFloat(item.querySelector(`.${closestSelector}-price`).textContent) *
      item.querySelector(`.${closestSelector}-input input`).value;
  });
  if (basketTotalSpan) {
    basketTotalSpan.textContent = `${sum.toFixed(2)} USD`;
  }
  basketFooterTotal.textContent = `${sum.toFixed(2)} USD`;
};
const setCatalogItemQuantity = () => {
  const newParams = new URLSearchParams(window.location.search);
  let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");

  const catalogItems = document.querySelectorAll(".catalog-item");
  const accountBasketItems = document.querySelectorAll(".basket-dropdown-item");
  accountBasketItems.forEach((itm) => {
    let basketName;
    if (itm.querySelector(".basket-dropdown-item-type").textContent == "") {
      basketName = itm.querySelector(".basket-dropdown-item-name").textContent;
    } else {
      if (urlType == "Stickers") {
        basketName = `${itm.querySelector(".basket-dropdown-item-name").textContent} | ${
          itm.querySelector(".basket-dropdown-item-type").textContent
        }`;
      } else {
        basketName = `${itm.querySelector(".basket-dropdown-item-type").textContent} | ${
          itm.querySelector(".basket-dropdown-item-name").textContent
        }`;
      }
    }
    let basketWear = itm.querySelector(".basket-dropdown-item-wear").textContent;
    let basketQuantity = itm.querySelector(".basket-dropdown-item-input input").value;
    catalogItems.forEach((item) => {
      if (
        item.querySelector(".name").textContent == basketName &&
        item.querySelector(".wear").textContent == basketWear
      ) {
        item.querySelector(".catalog-item-basket-quantity").textContent = basketQuantity;
        item.querySelector(".catalog-item-basket-quantity").style.visibility = "visible";
      }
    });
  });
};
const setCatalogItemFavValue = () => {
  const catalogItems = document.querySelectorAll(".catalog-item");
  catalogItems.forEach((item) => {
    let type = item.querySelector(".name").textContent.split("|")[0].trim();
    let name = item.querySelector(".name").textContent.split("|").pop("").trim();
    let wear = item.querySelector(".wear").textContent;

    const newParams = new URLSearchParams(window.location.search);
    let urlType = `${newParams.get("type")}`.replaceAll("★ ", "");

    if (urlType == "Stickers") {
      type = item.querySelector(".name").textContent.split("|").pop("").trim();
      name = item.querySelector(".name").textContent.split("|")[0].trim();
    }
    if (type == name) {
      type = "";
    }
    let fullNameWear = `fav.${type}${name}${wear}`.replaceAll(" ", "");

    Object.keys(localStorage).forEach((key) => {
      if (fullNameWear == key) {
        item.querySelector(".catalog-item-top-favourite ion-icon").style.color = "rgba(250, 25, 25, 1)";
        item.parentElement.querySelector(".backWall-footer-favourite-btn ion-icon").style.color =
          "rgba(250, 25, 25, 1)";
        item.parentElement.querySelector(".backWall-footer-favourite-btn").classList.add("inFav");
      }
    });
  });
};
const removeItemFromBasket = (e, closestSelector) => {
  let type = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-type`).textContent;
  let name = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-name`).textContent;
  let wear = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-wear`).textContent;

  let stringId = `${type}${name}${wear}`.replaceAll(" ", "");
  localStorage.removeItem(stringId);
  e.preventDefault();
  e.target.parentElement.parentElement.parentElement.parentElement.remove();

  countBasketItems(closestSelector);
  countBasketItemsPrice(closestSelector);

  if (document.body.id == "item") {
    displayItemQuantityAlert();
  }

  const catalogItems = document.querySelectorAll(".catalog-item");
  catalogItems &&
    catalogItems.forEach((item) => {
      item.querySelector(".catalog-item-basket-quantity").textContent = 0;
      item.querySelector(".catalog-item-basket-quantity").style.visibility = "hidden";
    });

  setCatalogItemQuantity();
};
const removeItemFromFavourite = (e) => {
  let type = e.target.closest(".favourite-dropdown-item").querySelector(".favourite-dropdown-item-type").textContent;
  let name = e.target.closest(".favourite-dropdown-item").querySelector(".favourite-dropdown-item-name").textContent;
  let wear = e.target.closest(".favourite-dropdown-item").querySelector(".favourite-dropdown-item-wear").textContent;

  let favStringId = `fav.${type}${name}${wear}`.replaceAll(" ", "");
  localStorage.removeItem(favStringId);
  e.preventDefault();
  e.target.parentElement.parentElement.parentElement.parentElement.remove();

  countFavouriteItems();

  const catalogItems = document.querySelectorAll(".catalog-item");
  catalogItems &&
    catalogItems.forEach((item) => {
      item.querySelector(".catalog-item-top-favourite ion-icon").style.color = "#686b6d";
      item.parentElement.querySelector(".backWall-footer-favourite-btn ion-icon").style.color = "#686b6d";
    });

  setCatalogItemFavValue();
};
const basketItemQuantityChangedClicked = (e, closestSelector) => {
  let type = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-type`).textContent;
  let name = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-name`).textContent;
  let wear = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-wear`).textContent;

  let stringId = `${type}${name}${wear}`.replaceAll(" ", "");
  e.preventDefault();
  let input = e.target.closest(`.${closestSelector}`).querySelector("input");

  if (e.target.closest(`.${closestSelector}-add`)) {
    e.preventDefault();
    if (input.value >= 100) return;
    input.value = Number(input.value) + 1;
  } else {
    e.preventDefault();
    if (input.value == 1) return;
    input.value = Number(input.value) - 1;
  }

  let localItem = JSON.parse(localStorage.getItem(stringId));
  localItem.localQuantity = input.value;
  localStorage.setItem(stringId, JSON.stringify(localItem));

  setCatalogItemQuantity();

  countBasketItemsPrice(closestSelector);
};
const basketItemQuantityChangedInput = (e, closestSelector) => {
  let type = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-type`).textContent;
  let name = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-name`).textContent;
  let wear = e.target.closest(`.${closestSelector}`).querySelector(`.${closestSelector}-wear`).textContent;

  let stringId = `${type}${name}${wear}`.replaceAll(" ", "");

  let input = e.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  if (input.value >= 100) {
    input.value = 100;
  }
  let localItem = JSON.parse(localStorage.getItem(stringId));
  localItem.localQuantity = input.value;
  localStorage.setItem(stringId, JSON.stringify(localItem));

  setCatalogItemQuantity();
};

window.addEventListener("click", (e) => {
  const basketDropdownItemQuantityAddBtns = e.target.closest(".basket-dropdown-item-add");
  const basketDropdownItemQuantityRemoveBtns = e.target.closest(".basket-dropdown-item-remove");
  const basketItemQuantityAddBtns = e.target.closest(".basket-item-add");
  const basketItemQuantityRemoveBtns = e.target.closest(".basket-item-remove");

  const basketDropdownItemInput = e.target.closest(".basket-dropdown-item-input input");
  const basketItemInput = e.target.closest(".basket-item-input input");

  const basketDropdownItemRemoveBtns = e.target.closest(".basket-dropdown-item-removeBtn");
  const favouriteDropdownItemRemoveBtns = e.target.closest(".favourite-dropdown-item-removeBtn");
  const basketItemRemoveBtns = e.target.closest(".basket-item-removeBtn");

  if (basketDropdownItemQuantityAddBtns || basketDropdownItemQuantityRemoveBtns) {
    let closestSelector = "basket-dropdown-item";
    basketItemQuantityChangedClicked(e, closestSelector);
  }

  if (basketItemQuantityAddBtns || basketItemQuantityRemoveBtns) {
    let closestSelector = "basket-item";
    basketItemQuantityChangedClicked(e, closestSelector);
  }

  if (basketDropdownItemInput) {
    let closestSelector = "basket-dropdown-item";
    basketDropdownItemInput.addEventListener("input", (e) => {
      basketItemQuantityChangedInput(e, closestSelector);
      countBasketItemsPrice(closestSelector);
    });
    e.preventDefault();
  }

  if (basketItemInput) {
    let closestSelector = "basket-item";
    basketItemInput.addEventListener("input", (e) => {
      basketItemQuantityChangedInput(e, closestSelector);
      countBasketItemsPrice(closestSelector);
    });
    e.preventDefault();
  }

  if (basketDropdownItemRemoveBtns) {
    let closestSelector = "basket-dropdown-item";
    removeItemFromBasket(e, closestSelector);
  }
  if (basketItemRemoveBtns) {
    let closestSelector = "basket-item";
    removeItemFromBasket(e, closestSelector);
  }
  if (favouriteDropdownItemRemoveBtns) {
    removeItemFromFavourite(e);
  }
});

const clearBasket = (selector) => {
  removeChilds(selector);

  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith("fav.")) {
      localStorage.removeItem(key);
    }
  });
  countBasketItems();
  countBasketItemsPrice();

  updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
  if (document.body.id == "basket") {
    updateBasket("basket-item", "basket-items-container");
  }
  if (document.body.id == "item") {
    displayItemQuantityAlert();
  }

  const catalogItems = document.querySelectorAll(".catalog-item");

  catalogItems &&
    catalogItems.forEach((item) => {
      item.querySelector(".catalog-item-basket-quantity").textContent = 0;
      item.querySelector(".catalog-item-basket-quantity").style.visibility = "hidden";
    });
};
const clearFavourite = () => {
  const favouriteItems = document.querySelectorAll(".account-favourite-dropdown-items a");
  favouriteItems.forEach((item) => item.remove());

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("fav.")) {
      localStorage.removeItem(key);
    }
  });
  countFavouriteItems();
  const catalogItems = document.querySelectorAll(".catalog-item");
  catalogItems &&
    catalogItems.forEach((item) => {
      item.querySelector(".catalog-item-top-favourite ion-icon").style.color = "#686b6d";
      item.parentElement.querySelector(".backWall-footer-favourite-btn ion-icon").style.color = "#686b6d";
    });
  updateFavourite();
};

const basketDropdownClearBtn = document.querySelector(".basket-dropdown-clear");
basketDropdownClearBtn.addEventListener("click", () => {
  let selector = document.querySelectorAll(".account-basket-dropdown-items a");
  clearBasket(selector);
});

const favouriteDropdownClearBtn = document.querySelector(".favourite-dropdown-clear");
favouriteDropdownClearBtn.addEventListener("click", () => {
  clearFavourite();
});

const basketClearBtn = document.querySelector(".basket-clear");
basketClearBtn &&
  basketClearBtn.addEventListener("click", () => {
    let selector = document.querySelectorAll(".basket-items-container a");
    clearBasket(selector);
  });

const accountBasket = document.querySelector(".account-basket");
const accountBasketDropdown = document.querySelector(".account-basket-dropdown");

const accountProfile = document.querySelector(".account-profile");
const accountProfileDropdown = document.querySelector(".account-profile-dropdown");

const accountFavourite = document.querySelector(".account-favourite");
const accountFavouriteDropdown = document.querySelector(".account-favourite-dropdown");

const showHideBasketDropdown = (e) => {
  updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
  accountProfileDropdown.style.visibility = "hidden";
  accountFavouriteDropdown.style.visibility = "hidden";
  if (accountBasketDropdown.style.visibility === "visible") {
    accountBasketDropdown.style.visibility = "hidden";
  } else {
    accountBasketDropdown.style.visibility = "visible";
  }
};
const showHideFavouriteDropdown = (e) => {
  updateFavourite();
  accountProfileDropdown.style.visibility = "hidden";
  accountBasketDropdown.style.visibility = "hidden";
  if (accountFavouriteDropdown.style.visibility === "visible") {
    accountFavouriteDropdown.style.visibility = "hidden";
  } else {
    accountFavouriteDropdown.style.visibility = "visible";
  }
};
const showHideAccountProfileDropdown = (e) => {
  accountBasketDropdown.style.visibility = "hidden";
  accountFavouriteDropdown.style.visibility = "hidden";
  accountProfileDropdown.style.visibility === "visible"
    ? (accountProfileDropdown.style.visibility = "hidden")
    : (accountProfileDropdown.style.visibility = "visible");
};
if (document.body.id != "basket") {
  accountBasket.addEventListener("click", showHideBasketDropdown);
}
accountFavourite.addEventListener("click", showHideFavouriteDropdown);
accountProfile.addEventListener("click", showHideAccountProfileDropdown);

const basketDropdownCloseBtn = document.querySelector(".basket-dropdown-header-right");
basketDropdownCloseBtn.addEventListener("click", () => {
  accountBasketDropdown.style.visibility = "hidden";
});
const favouriteDropdownCloseBtn = document.querySelector(".favourite-dropdown-header-right");
favouriteDropdownCloseBtn.addEventListener("click", () => {
  accountFavouriteDropdown.style.visibility = "hidden";
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".account-profile-dropdown") && !e.target.closest(".account-profile")) {
    accountProfileDropdown.style.visibility = "hidden";
  }
});

document.querySelector(".basket-dropdown-view-btn").addEventListener("click", () => {
  window.location.href = "basket.html";
});
////////// FUNCTION FOR FIXING ERRORS
const getData = () => {
  let page = document.body.id;
  switch (page) {
    case "index":
      displayNewContent();
      getNewItems();
      updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
      updateFavourite();
      countBasketItems("basket-dropdown-item");
      break;
    case "market":
      skeletonCatalog();
      hideCatalogSortSearch();
      getMarketItems();
      displaySortCategories();
      updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
      updateFavourite();
      countBasketItems("basket-dropdown-item");
      break;
    case "item":
      getCatalogItem();
      updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
      updateFavourite();
      countBasketItems("basket-dropdown-item");
      break;
    case "basket":
      updateBasket("basket-dropdown-item", "account-basket-dropdown-items");
      updateBasket("basket-item", "basket-items-container");
      updateFavourite();
      countBasketItems("basket-item");
      break;
  }
};
getData();
