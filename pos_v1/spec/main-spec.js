'use strict';
const {
    printReceipt,
    calculateEachItemCount,
    getEachItemInfo,
    calculateSumPrice,
    calculateDiscSumPriceAndGetInfo
} = require('../main/main');
const {loadAllItems,loadPromotions} = require('../spec/fixtures');

describe('Unit test', () => {

  it('1 - Calculate the count of products', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    // spyOn(console, 'log');

    const expectResult = JSON.stringify(calculateEachItemCount(tags));
    const actualResult = JSON.stringify([
      {barcode: 'ITEM000001',count: 5},
      {barcode: 'ITEM000003',count: 2.5},
      {barcode: 'ITEM000005',count: 3},
    ]);
    expect(expectResult).toBe(actualResult);
  });
});

describe('Unit test', () => {

  it('2 - Compare and get the information of products', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    let eiCount = calculateEachItemCount(tags);
    const allItemsInfo = loadAllItems(); // 所有商品信息

    const expectResult = JSON.stringify(getEachItemInfo(eiCount,allItemsInfo));
    const actualResult = JSON.stringify([
      {"barcode":"ITEM000001","name":"雪碧","unit":"瓶","price":3,"count":5},
      {"barcode":"ITEM000003","name":"荔枝","unit":"斤","price":15,"count":2.5},
      {"barcode":"ITEM000005","name":"方便面","unit":"袋","price":4.5,"count":3}
    ]);
    expect(expectResult).toBe(actualResult);
  });
});

describe('Unit test', () => {

  it('3 - Calculate the original total price of products', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    let eiCount = calculateEachItemCount(tags);
    const allItemsInfo = loadAllItems(); // 所有商品信息
    let eiInfo = getEachItemInfo(eiCount,allItemsInfo);
    const expectResult = calculateSumPrice(eiInfo);
    const actualResult = 66;
    expect(expectResult).toBe(actualResult);
  });
});

describe('Unit test', () => {

  it('4 - Get the information of products in discount ', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    let eiCount = calculateEachItemCount(tags);
    const allItemsInfo = loadAllItems(); // 所有商品信息
    let eiInfo = getEachItemInfo(eiCount,allItemsInfo);
    const discItemsCode = loadPromotions(); // 优惠商品条形码
    const expectResult = JSON.stringify(calculateDiscSumPriceAndGetInfo(eiInfo,discItemsCode));;
    const actualResult = JSON.stringify([
      { barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3, count: 5, sum: 12 },
      { barcode: 'ITEM000003', name: '荔枝', unit: '斤', price: 15, count: 2.5, sum: 37.5 },
      { barcode: 'ITEM000005', name: '方便面', unit: '袋', price: 4.5, count: 3, sum: 9 }
    ]);
    expect(expectResult).toBe(actualResult);
  });
});

describe('pos', () => {

  it('5 - Print the receipt', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});