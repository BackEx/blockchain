#!/usr/bin/env node

var Web3 = require('web3');
var restify = require('restify');


if (typeof window !== 'undefined' && typeof window.Web3 === 'undefined') {
    window.Web3 = Web3;
}

module.exports = Web3;

var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://207.46.137.118:8080'));

console.log('Start account ' + web3.eth.accounts[0] + ' unlock proccess...')
var success = web3.personal.unlockAccount(web3.eth.accounts[0],'13548975', 1000)
console.log('Unlock proccess result...' + success)

function getBalance(req, res, next) {
  var coinbase = web3.eth.coinbase;
  console.log(coinbase);

  var balance = web3.eth.getBalance(coinbase);
  console.log(balance.toString(10));
  res.send(balance.toString(10));
  next();
}


function createBuyer(req, res, next) {
  var source = "" +
  "contract buyer {\n" +
  " string nick;\n" +

  " function buyer(string _nick) public {\n" +
  "   nick = _nick;\n" +
  " }\n" +
  "}\n";

  console.log('Create smart-contract for buyer: ' + req.params.buyer)
  var myContract;

  web3.eth.defaultAccount = web3.eth.coinbase;

  var compiled = web3.eth.compile.solidity(source);
  console.log(compiled)
  var code = compiled.buyer.code;
  var abi = compiled.buyer.info.abiDefinition;


  web3.eth.contract(abi).new({data: code}, function (err, contract) {
    if (err) {
      console.error(err);
      return;

    } else if(contract.address) {
      myContract = contract;
      console.log('address: ' + myContract.address + ', mined!');
      res.send(myContract.address);
      next();
    }
  });
}

function createSeller(req, res, next) {
  var source = "" +
  "contract seller {\n" +
  " string nick;\n" +

  " function seller(string _nick) public {\n" +
  "   nick = _nick;\n" +
  " }\n" +
  "}\n";

  var myContract;

  console.log('Create smart-contract for seller: ' + req.params.seller)
  web3.eth.defaultAccount = web3.eth.coinbase;

  var compiled = web3.eth.compile.solidity(source);
  console.log(compiled)
  var code = compiled.seller.code;
  var abi = compiled.seller.info.abiDefinition;


  web3.eth.contract(abi).new({data: code}, function (err, contract) {
    if (err) {
      console.error(err);
      return;

    } else if(contract.address) {
      myContract = contract;
      console.log('address: ' + myContract.address + ', mined!');
      res.send(myContract.address);
      next();
    }
  });
}

function createDeal(req, res, next) {
  var source = "" +
  "contract deal {\n" +
  "  address buyer;\n" +
  "  address seller;\n" +
  "  bool is_offer_provided = false;\n" +
  "  bool is_get_payment = false;\n" +
  "  bool is_complete = false;\n" +
  "  \n" +
  "  function deal(address _buyer, address _seller) public {\n" +
  "      buyer = _buyer;\n" +
  "      seller = _seller;\n" +
  "  }\n" +
  "  \n" +
  "  function offerHasProvided() {\n" +
  "      is_offer_provided = true;\n" +
  "  }\n" +
  "  \n" +
  "  function isOfferProvided() constant returns (bool) {\n" +
  "      return is_offer_provided;\n" +
  "  }\n" +
  "  \n" +
  "  function setPaymentStatus() {\n" +
  "      is_get_payment = true;\n" +
  "  }\n" +
  "  \n" +
  "  function getPaymentStatus() constant returns (bool) {\n" +
  "      return is_get_payment;\n" +
  "  }\n" +
  "  \n" +
  "  function complete() constant returns (bool) {\n" +
  "      if (getPaymentStatus() && isOfferProvided()) {\n" +
  "          is_complete = true;\n" +
  "          return true;\n" +
  "      }\n" +
  "  }\n" +
  "}\n";

  var myContract;

  console.log('register smart-contract between seller: ' + req.params.seller + ' and buyer: ' + req.params.buyer)

  web3.eth.defaultAccount = web3.eth.coinbase;

  var compiled = web3.eth.compile.solidity(source);
  console.log(compiled)
  var code = compiled.deal.code;
  var abi = compiled.deal.info.abiDefinition;

  web3.eth.contract(abi).new({data: code}, function (err, contract) {
    if (err) {
      console.error(err);
      return;

    } else if(contract.address) {
      myContract = contract;
      console.log('address: ' + myContract.address + ', mined!');
      res.send(myContract.address);
      next();
    }
  });
}

function provided(req, res, next) {
  var source = "" +
  "contract deal {\n" +
  "  address buyer;\n" +
  "  address seller;\n" +
  "  bool is_offer_provided = false;\n" +
  "  bool is_get_payment = false;\n" +
  "  bool is_complete = false;\n" +
  "  \n" +
  "  function deal(address _buyer, address _seller) public {\n" +
  "      buyer = _buyer;\n" +
  "      seller = _seller;\n" +
  "  }\n" +
  "  \n" +
  "  function offerHasProvided() {\n" +
  "      is_offer_provided = true;\n" +
  "  }\n" +
  "  \n" +
  "  function isOfferProvided() constant returns (bool) {\n" +
  "      return is_offer_provided;\n" +
  "  }\n" +
  "  \n" +
  "  function setPaymentStatus() {\n" +
  "      is_get_payment = true;\n" +
  "  }\n" +
  "  \n" +
  "  function getPaymentStatus() constant returns (bool) {\n" +
  "      return is_get_payment;\n" +
  "  }\n" +
  "  \n" +
  "  function complete() constant returns (bool) {\n" +
  "      if (getPaymentStatus() && isOfferProvided()) {\n" +
  "          is_complete = true;\n" +
  "          return true;\n" +
  "      }\n" +
  "  }\n" +
  "}\n";

  var myContract;

  console.log('register smart-contract between seller: ' + req.params.seller + ' and buyer: ' + req.params.buyer)

  web3.eth.defaultAccount = web3.eth.coinbase;

  var compiled = web3.eth.compile.solidity(source);
  console.log(compiled)
  var code = compiled.deal.code;
  var abi = compiled.deal.info.abiDefinition;

  web3.eth.contract(abi).new({data: code}, function (err, contract) {
    if (err) {
      console.error(err);
      return;

    } else if(contract.address) {
      myContract = contract;
      console.log('address: ' + myContract.address + ', mined!');
      res.send(myContract.address);
      next();
    }
  });
}


function payment(req, res, next) {
  var source = "" +
  "contract deal {\n" +
  "  address buyer;\n" +
  "  address seller;\n" +
  "  bool is_offer_provided = false;\n" +
  "  bool is_get_payment = false;\n" +
  "  bool is_complete = false;\n" +
  "  \n" +
  "  function deal(address _buyer, address _seller) public {\n" +
  "      buyer = _buyer;\n" +
  "      seller = _seller;\n" +
  "  }\n" +
  "  \n" +
  "  function offerHasProvided() {\n" +
  "      is_offer_provided = true;\n" +
  "  }\n" +
  "  \n" +
  "  function isOfferProvided() constant returns (bool) {\n" +
  "      return is_offer_provided;\n" +
  "  }\n" +
  "  \n" +
  "  function setPaymentStatus() {\n" +
  "      is_get_payment = true;\n" +
  "  }\n" +
  "  \n" +
  "  function getPaymentStatus() constant returns (bool) {\n" +
  "      return is_get_payment;\n" +
  "  }\n" +
  "  \n" +
  "  function complete() constant returns (bool) {\n" +
  "      if (getPaymentStatus() && isOfferProvided()) {\n" +
  "          is_complete = true;\n" +
  "          return true;\n" +
  "      }\n" +
  "  }\n" +
  "}\n";

  var myContract;

  console.log('register smart-contract between seller: ' + req.params.seller + ' and buyer: ' + req.params.buyer)

  web3.eth.defaultAccount = web3.eth.coinbase;

  var compiled = web3.eth.compile.solidity(source);
  console.log(compiled)
  var code = compiled.deal.code;
  var abi = compiled.deal.info.abiDefinition;

  web3.eth.contract(abi).new({data: code}, function (err, contract) {
    if (err) {
      console.error(err);
      return;

    } else if(contract.address) {
      myContract = contract;
      console.log('address: ' + myContract.address + ', mined!');
      res.send(myContract.address);
      next();
    }
  });
}


function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/balance', getBalance);
server.get('/buyer/create/:buyer', createBuyer);
server.get('/seller/create/:seller', createSeller);
server.get('/deal/create/:buyer/:seller', createDeal);
server.get('/deal/provided/:deal', provided);
server.get('/deal/payment/:deal', payment);

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
