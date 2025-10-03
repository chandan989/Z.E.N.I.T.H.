// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Exchange
 * @dev A simple order-book style exchange for trading fractional ERC20 tokens.
 * This version includes partial fills and order book queries.
 */
contract Exchange is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _orderIds;

    address public paymentTokenAddress;

    struct Order {
        uint id;
        address token;
        address owner;
        bool isBuyOrder;
        uint amount; // Amount of 'token' remaining
        uint price;
    }

    // Mappings for orders
    mapping(address => mapping(uint => Order)) public buyOrders;
    mapping(address => mapping(uint => Order)) public sellOrders;

    // Data structures to query order books
    mapping(address => uint[]) public buyOrderIdsByToken;
    mapping(address => uint[]) public sellOrderIdsByToken;
    mapping(uint => uint) private buyOrderIdToIndex;
    mapping(uint => uint) private sellOrderIdToIndex;

    // Events
    event OrderCreated(uint orderId, address indexed token, address indexed owner, bool isBuyOrder, uint amount, uint price);
    event OrderCancelled(uint orderId, address indexed token, address indexed owner, bool isBuyOrder);
    event OrderFilled(uint orderId, address indexed token, address indexed filler, address indexed orderOwner, bool isBuyOrderFilled, uint amountFilled, uint price);

    constructor() Ownable(msg.sender) {}

    modifier orderExists(bool isBuyOrder, address token, uint orderId) {
        if (isBuyOrder) {
            require(buyOrders[token][orderId].id != 0, "Buy order does not exist");
        } else {
            require(sellOrders[token][orderId].id != 0, "Sell order does not exist");
        }
        _;
    }

    function setPaymentToken(address _paymentTokenAddress) external onlyOwner {
        paymentTokenAddress = _paymentTokenAddress;
    }

    function createLimitOrder(address token, bool isBuyOrder, uint amount, uint price) external {
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");

        _orderIds.increment();
        uint orderId = _orderIds.current();

        if (isBuyOrder) {
            uint totalCost = amount * price;
            require(IERC20(paymentTokenAddress).transferFrom(msg.sender, address(this), totalCost), "Payment token transfer failed");
            buyOrders[token][orderId] = Order(orderId, token, msg.sender, true, amount, price);
            _addBuyOrderId(token, orderId);
        } else {
            require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Fractional token transfer failed");
            sellOrders[token][orderId] = Order(orderId, token, msg.sender, false, amount, price);
            _addSellOrderId(token, orderId);
        }

        emit OrderCreated(orderId, token, msg.sender, isBuyOrder, amount, price);
    }

    function fillOrder(address token, uint orderId, bool isBuyOrderToFill, uint amountToFill) external orderExists(isBuyOrderToFill, token, orderId) {
        require(amountToFill > 0, "Amount to fill must be > 0");

        if (isBuyOrderToFill) {
            Order storage order = buyOrders[token][orderId];
            require(amountToFill <= order.amount, "Fill amount exceeds order amount");

            IERC20 fractionalToken = IERC20(token);
            require(fractionalToken.transferFrom(msg.sender, order.owner, amountToFill), "Token transfer to buyer failed");

            uint value = amountToFill * order.price;
            require(IERC20(paymentTokenAddress).transfer(msg.sender, value), "Payment to seller failed");

            order.amount -= amountToFill;
            emit OrderFilled(orderId, token, msg.sender, order.owner, true, amountToFill, order.price);

            if (order.amount == 0) {
                _removeBuyOrderId(token, orderId);
                delete buyOrders[token][orderId];
            }
        } else {
            Order storage order = sellOrders[token][orderId];
            require(amountToFill <= order.amount, "Fill amount exceeds order amount");

            uint totalCost = amountToFill * order.price;
            require(IERC20(paymentTokenAddress).transferFrom(msg.sender, order.owner, totalCost), "Payment to seller failed");

            IERC20 fractionalToken = IERC20(token);
            require(fractionalToken.transfer(msg.sender, amountToFill), "Token transfer to buyer failed");

            order.amount -= amountToFill;
            emit OrderFilled(orderId, token, msg.sender, order.owner, false, amountToFill, order.price);

            if (order.amount == 0) {
                _removeSellOrderId(token, orderId);
                delete sellOrders[token][orderId];
            }
        }
    }

    function cancelOrder(address token, uint orderId, bool isBuyOrder) external orderExists(isBuyOrder, token, orderId) {
        if (isBuyOrder) {
            Order storage order = buyOrders[token][orderId];
            require(order.owner == msg.sender, "Not the order owner");

            uint totalCost = order.amount * order.price;
            require(IERC20(paymentTokenAddress).transfer(order.owner, totalCost), "Refund failed");

            _removeBuyOrderId(token, orderId);
            emit OrderCancelled(orderId, token, order.owner, true);
            delete buyOrders[token][orderId];
        } else {
            Order storage order = sellOrders[token][orderId];
            require(order.owner == msg.sender, "Not the order owner");

            require(IERC20(token).transfer(order.owner, order.amount), "Token return failed");

            _removeSellOrderId(token, orderId);
            emit OrderCancelled(orderId, token, order.owner, false);
            delete sellOrders[token][orderId];
        }
    }

    // --- Internal functions for managing order ID arrays ---
    function _addBuyOrderId(address token, uint orderId) private {
        buyOrderIdsByToken[token].push(orderId);
        buyOrderIdToIndex[orderId] = buyOrderIdsByToken[token].length - 1;
    }

    function _addSellOrderId(address token, uint orderId) private {
        sellOrderIdsByToken[token].push(orderId);
        sellOrderIdToIndex[orderId] = sellOrderIdsByToken[token].length - 1;
    }

    function _removeBuyOrderId(address token, uint orderId) private {
        uint index = buyOrderIdToIndex[orderId];
        uint lastOrderId = buyOrderIdsByToken[token][buyOrderIdsByToken[token].length - 1];
        buyOrderIdsByToken[token][index] = lastOrderId;
        buyOrderIdToIndex[lastOrderId] = index;
        buyOrderIdsByToken[token].pop();
        delete buyOrderIdToIndex[orderId];
    }

    function _removeSellOrderId(address token, uint orderId) private {
        uint index = sellOrderIdToIndex[orderId];
        uint lastOrderId = sellOrderIdsByToken[token][sellOrderIdsByToken[token].length - 1];
        sellOrderIdsByToken[token][index] = lastOrderId;
        sellOrderIdToIndex[lastOrderId] = index;
        sellOrderIdsByToken[token].pop();
        delete sellOrderIdToIndex[orderId];
    }
}
