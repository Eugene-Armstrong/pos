'use strict';

const allItemsInfo = loadAllItems(); // 所有商品信息
const discItemsCode = loadPromotions(); // 优惠商品条形码

function printReceipt(tags) {

    // 1 计算出所买商品的个数
    const eiCount = calculateEachItemCount(tags);

    // 2 比对并整合所买商品的信息
    let eiInfo = getEachItemInfo(eiCount, allItemsInfo);

    // 3 计算出优惠前的原总价
    const sumPrice = calculateSumPrice(eiInfo);
    // return sumPrice;

    // 4 计算出优惠后的商品信息
    const discItems = calculateDiscSumPriceAndGetInfo(eiInfo, discItemsCode);

    // 5 打印收据
    print(eiInfo, discItems, sumPrice);
}

/**
 * 打印收据
 * @param  eiInfo    [所买商品的信息]
 * @param  discItems [优惠后的商品信息]
 * @param  sumPrice  [优惠前的原总价]
 */
function print(eiInfo, discItems, sumPrice) {
    let receipt = "***<没钱赚商店>收据***\n";
    for (let eachItemObj of eiInfo) {
        receipt += "名称：" + eachItemObj.name + "，数量：" + eachItemObj.count + eachItemObj.unit +
            "，单价：" + eachItemObj.price.toFixed(2) + "(元)，小计：" + eachItemObj.sum.toFixed(2) + "(元)\n";
    }

    // 计算差价
    const discSumP = calculateDiscSumPrice(discItems).toFixed(2);
    const save = (sumPrice.toFixed(2) - discSumP).toFixed(2);

    receipt += "----------------------\n" +
        "总计：" + discSumP + "(元)\n" +
        "节省：" + save + "(元)\n" +
        "**********************";

    // 打印收据
    console.log(receipt);
}

/**
 * 计算出优惠后的商品小记并整合
 * @param eiInfo
 * @param discItemsCode
 * @returns {number}
 * @constructor
 */
function calculateDiscSumPriceAndGetInfo(eiInfo, discItemsCode) {
    for (let eachItemObj of eiInfo) {
        let c = eachItemObj.count;
        let chk = false;
        for (let j = 0; j < discItemsCode[0].barcodes.length && !chk; j++) {
            if (discItemsCode[0].barcodes[j] === eachItemObj.barcode) {
                chk = true; break;
            }
        }
        if (chk) {
            c = eachItemObj.count - Math.floor(eachItemObj.count / 3);
        }
        eachItemObj.sum = eachItemObj.price * c;
    }
    return eiInfo;
}

/**
 * 计算所买商品优惠后的总价
 * @param eiInfo
 * @returns {number}
 * @constructor
 */
function calculateDiscSumPrice(eiInfo) {
    let discPrice = 0;
    for (let eachItemObj of eiInfo) {
        discPrice += eachItemObj.sum;
    }
    return discPrice;
}

/**
 * 计算所买商品优惠前的原总价
 * @param eiInfo
 * @returns {number}
 * @constructor
 */
function calculateSumPrice(eiInfo) {
    let sumPrice = 0;
    for (let eachItemObj of eiInfo) {
        sumPrice += eachItemObj.count * eachItemObj.price;
    }
    return sumPrice;
}

/**
 * 整合所买每种商品的信息
 * @param  eiCount      [所买商品个数]
 * @param  allItemsInfo [所有商品信息]
 */
function getEachItemInfo(eiCount, allItemsInfo) {
    let result = [];
    for (let allItemsObj of allItemsInfo) {
        for (let eachItemObj of eiCount) {
            if (eachItemObj.barcode === allItemsObj.barcode) {
                result.push({
                    barcode: allItemsObj.barcode,
                    name: allItemsObj.name,
                    unit: allItemsObj.unit,
                    price: allItemsObj.price,
                    count: eachItemObj.count
                });
            }
        }
    }
    return result;
}

/**
 * 计算所买每种商品的个数
 * @param  tags [所买商品条形码]
 */
function calculateEachItemCount(tags) {
    //格式化代码
    let formattedBarcodes = buildFormattedBarcodes(tags);
    let result = buildCartItems(formattedBarcodes);
    return result;
}

function buildFormattedBarcodes(tags) {
    let formattedBarcodes = [];
    for (let tag of tags) {
        let barcodeObject = {
            barcode: tag,
            count: 1
        }
        if (tag.indexOf("-") !== -1) {
            let tempArray = tag.split("-");
            barcodeObject = {
                barcode: tempArray[0],
                count: parseFloat(tempArray[1])
            }
        }
        formattedBarcodes.push(barcodeObject);
    }
    // console.info(formattedBarcodes);
    return formattedBarcodes;
}

function buildCartItems(formattedBarcodes) {
    let cartItems = [];

    for (let formattedBarcode of formattedBarcodes) {
        let existCartItem = null;
        for (let cartItem of cartItems) {
            if (cartItem.barcode === formattedBarcode.barcode) {
                existCartItem = cartItem;
            }
        }
        if (existCartItem != null) {
            existCartItem.count += formattedBarcode.count;
        } else {
            cartItems.push(formattedBarcode);
        }
    }

    // console.info(cartItems);
    return cartItems;
}
