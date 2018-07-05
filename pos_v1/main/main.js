'use strict';

const allItemsInfo = loadAllItems(); // 所有商品信息
const discItemsCode = loadPromotions(); // 优惠商品条形码

function printReceipt(tags) {

  // 1 计算出所买商品的个数
	const eiCount = EachItemCount(tags);

  // 2 比对并整合所买商品的信息
	var eiInfo = EachItemInfo(eiCount,allItemsInfo);
  return eiInfo;

  // 3 计算出优惠前的原总价
  const sumPrice = OriginalSumPrice(eiInfo);
  // alert(sumPrice);

  // 4 计算出优惠后的商品信息
  const discItems = DiscountSumPrice(eiInfo,discItemsCode);

  // 5 打印收据
  print(eiInfo,discItems,sumPrice);
}

/**
 * 打印收据
 * @param  {[type]} eiInfo    [所买商品的信息]
 * @param  {[type]} discItems [优惠后的商品信息]
 * @param  {[type]} sumPrice  [优惠前的原总价]
 */
function print(eiInfo,discItems,sumPrice){
  var receipt = "***<没钱赚商店>收据***\n";
  for(var i=0;i<eiInfo.length;i++){
    receipt += "名称："+eiInfo[i].name+"，数量："+eiInfo[i].count+eiInfo[i].unit+
      "，单价："+eiInfo[i].price.toFixed(2)+"(元)，小计："+eiInfo[i].sum.toFixed(2)+"(元)\n";
  }

  // 计算差价
  const discSumP = DiscSumPrice(discItems).toFixed(2);
  const save = (sumPrice.toFixed(2) - discSumP).toFixed(2);

  receipt += "----------------------\n" +
    "总计："+discSumP+"(元)\n" +
    "节省："+save+"(元)\n" +
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
function DiscountSumPrice(eiInfo,discItemsCode) {
  for(var i=0;i<eiInfo.length;i++){
    var tmp = eiInfo[i];
    var c = tmp.count;
    var chk = false;
    for(var j=0;j<discItemsCode[0].barcodes.length && chk === false;j++){
      if(discItemsCode[0].barcodes[j] === tmp.barcode){
        chk = true;
      }
    }
    if(tmp.count > 2 && chk){
      c = tmp.count -1;
    }
    eiInfo[i].sum = tmp.price*c;
  }
  return eiInfo;
}

/**
 * 计算所买商品优惠后的总价
 * @param eiInfo
 * @returns {number}
 * @constructor
 */
function DiscSumPrice(eiInfo) {
  var discPrice = 0;
  for(var i=0; i<eiInfo.length; i++){
    discPrice += eiInfo[i].sum;
  }
  return discPrice;
}

/**
 * 计算所买商品优惠前的原总价
 * @param eiInfo
 * @returns {number}
 * @constructor
 */
function OriginalSumPrice(eiInfo) {
  var sumPrice = 0;
  for(var i=0; i<eiInfo.length; i++){
    sumPrice += eiInfo[i].count * eiInfo[i].price;
  }
  return sumPrice;
}

/**
 * 整合所买每种商品的信息
 * @param {[Array]} eiCount      [所买商品个数]
 * @param {[Array]} allItemsInfo [所有商品信息]
 */
function EachItemInfo(eiCount,allItemsInfo) {
	var result = [];
	for(var i=0;i<allItemsInfo.length;i++){
    for(var j=0;j<eiCount.length;j++){
      var tmp = allItemsInfo[i];
      if(eiCount[j].barcode === tmp.barcode){
        result.push({
          barcode:tmp.barcode,
          name:tmp.name,
          unit:tmp.unit,
          price:tmp.price,
          count:eiCount[j].count
        });
      }
    }
  }
	return result;
}

/**
 * 计算所买每种商品的个数
 * @param {[Array]} tags [所买商品条形码]
 */
function EachItemCount(tags) {
	var arr = [];
	var ck = true;
	for (var i = 0; i < tags.length; i++) {
		var num = 0;
		for (var j = i; j < tags.length; j++) {
			if (tags[i] === tags[j]) {
				num++;
			}
		}
		var tmpStr = tags[i].toString();
		if(tmpStr.length>10){
			ck = false;
			tags[i] = tmpStr.substr(0,10);
			num = parseFloat(tmpStr.split("-")[1]);
		}
		if(i===tags.length-1){
			num++;
		}
		arr.push({
			barcode: tags[i],
			count: num
		});
		if(ck){
			i+=num-1;
		}
	}
	arr.splice(2,1);
	return arr;
}
