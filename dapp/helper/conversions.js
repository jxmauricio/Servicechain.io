const axios = require("axios");

export const options = {
  method: 'GET',
  url: 'https://coingecko.p.rapidapi.com/simple/price',
  params: {ids: 'ethereum', vs_currencies: 'usd'},
  headers: {
    'X-RapidAPI-Key': '34347087d1msh0501a41e975faa6p183306jsn1d5d045c57ad',
    'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
  }
};
//REQUEST THE SINGLE VALUE THEN SET TO STATE
//FUNCTIONS BELOW WILL BE NEEDED TO IMPORT SO THAT WE CAN MAP BETWEEN CURRENCIES
//CHANGE TMMRW
export const usdToWei = (dollarAmount,marketPriceEth)=>{
    const etherToWei = 1000000000000000000;
    const dollarToWei = etherToWei/marketPriceEth;
    return Math.round(dollarToWei * dollarAmount);
}
export const weiToUsd = (wei,marketPriceEth)=>{
    const etherToWei = 1000000000000000000;
    const weiToDollar = marketPriceEth/etherToWei;
    return Math.round(weiToDollar*wei*100)/100;
}


