// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ExchangeETH
 * @dev Exchange that uses native ETH instead of payment token
 * Simpler for demo - no need to deploy USDC
 */
contract ExchangeETH is Ownable, ReentrancyGuard {
    uint256 private _orderIds;
    uint256 public constant MIN_ORDER_SIZE = 1e15;

    struct Order {
        uint id;
        address token;
        address owner;
        bool isBuyOrder;
        uint amount;
        uint price; // Price in wei (ETH)
    }

    mapping(address => mapping(uint => Order)) public buyOrders;
    mapping(address => mapping(uint => Order)) public sellOrders;
    mapping(address => uint[]) public buyOrderIdsByToken;
    mapping(address => uint[]) public sellOrderIdsByToken;
    mapping(uint => uint) private buyOrderIdToIndex;
    mapping(uint => uint) private sellOrderIdToIndex;

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

    // Create buy order - user sends ETH
    function createBuyOrder(address token, uint amount, uint price) external payable nonReentrant {
        require(amount >= MIN_ORDER_SIZE, "Order too small");
        require(price > 0, "Price must be > 0");
        require(token != address(0), "Invalid token address");
        
        uint totalCost = (amount * price) / 1e18;
        require(msg.value == totalCost, "Incorrect ETH amount");

        _orderIds++;
        uint orderId = _orderIds;

        buyOrders[token][orderId] = Order(orderId, token, msg.sender, true, amount, price);
        _addBuyOrderId(token, orderId);

        emit OrderCreated(orderId, token, msg.sender, true, amount, price);
    }

    // Create sell order - user locks tokens
    function createSellOrder(address token, uint amount, uint price) external nonReentrant {
        require(amount >= MIN_ORDER_SIZE, "Order too small");
        require(price > 0, "Price must be > 0");
        
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        _orderIds++;
        uint orderId = _orderIds;

        sellOrders[token][orderId] = Order(orderId, token, msg.sender, false, amount, price);
        _addSellOrderId(token, orderId);

        emit OrderCreated(orderId, token, msg.sender, false, amount, price);
    }

    // Fill buy order - seller sends tokens, gets ETH
    function fillBuyOrder(address token, uint orderId, uint amountToFill) external nonReentrant orderExists(true, token, orderId) {
        require(amountToFill > 0, "Amount must be > 0");
        
        Order storage order = buyOrders[token][orderId];
        require(order.owner != msg.sender, "Cannot fill own order");
        require(amountToFill <= order.amount, "Fill amount exceeds order");

        IERC20 fractionalToken = IERC20(token);
        require(fractionalToken.transferFrom(msg.sender, order.owner, amountToFill), "Token transfer failed");

        uint value = (amountToFill * order.price) / 1e18;
        payable(msg.sender).transfer(value);

        order.amount -= amountToFill;
        emit OrderFilled(orderId, token, msg.sender, order.owner, true, amountToFill, order.price);

        if (order.amount == 0) {
            _removeBuyOrderId(token, orderId);
            delete buyOrders[token][orderId];
        }
    }

    // Fill sell order - buyer sends ETH, gets tokens
    function fillSellOrder(address token, uint orderId, uint amountToFill) external payable nonReentrant orderExists(false, token, orderId) {
        require(amountToFill > 0, "Amount must be > 0");
        
        Order storage order = sellOrders[token][orderId];
        require(order.owner != msg.sender, "Cannot fill own order");
        require(amountToFill <= order.amount, "Fill amount exceeds order");

        uint totalCost = (amountToFill * order.price) / 1e18;
        require(msg.value == totalCost, "Incorrect ETH amount");

        payable(order.owner).transfer(totalCost);
        
        IERC20 fractionalToken = IERC20(token);
        require(fractionalToken.transfer(msg.sender, amountToFill), "Token transfer failed");

        order.amount -= amountToFill;
        emit OrderFilled(orderId, token, msg.sender, order.owner, false, amountToFill, order.price);

        if (order.amount == 0) {
            _removeSellOrderId(token, orderId);
            delete sellOrders[token][orderId];
        }
    }

    // Cancel orders and refund
    function cancelOrder(address token, uint orderId, bool isBuyOrder) external nonReentrant orderExists(isBuyOrder, token, orderId) {
        if (isBuyOrder) {
            Order storage order = buyOrders[token][orderId];
            require(order.owner == msg.sender, "Not the order owner");

            uint totalCost = (order.amount * order.price) / 1e18;
            payable(order.owner).transfer(totalCost);

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

    // Helper functions (same as before)
    function _addBuyOrderId(address token, uint orderId) private {
        buyOrderIdsByToken[token].push(orderId);
        buyOrderIdToIndex[orderId] = buyOrderIdsByToken[token].length - 1;
    }

    function _addSellOrderId(address token, uint orderId) private {
        sellOrderIdsByToken[token].push(orderId);
        sellOrderIdToIndex[orderId] = sellOrderIdsByToken[token].length - 1;
    }

    function _removeBuyOrderId(address token, uint orderId) private {
        uint[] storage orderIds = buyOrderIdsByToken[token];
        require(orderIds.length > 0, "No orders to remove");
        
        uint index = buyOrderIdToIndex[orderId];
        uint lastIndex = orderIds.length - 1;
        
        if (index != lastIndex) {
            uint lastOrderId = orderIds[lastIndex];
            orderIds[index] = lastOrderId;
            buyOrderIdToIndex[lastOrderId] = index;
        }
        
        orderIds.pop();
        delete buyOrderIdToIndex[orderId];
    }

    function _removeSellOrderId(address token, uint orderId) private {
        uint[] storage orderIds = sellOrderIdsByToken[token];
        require(orderIds.length > 0, "No orders to remove");
        
        uint index = sellOrderIdToIndex[orderId];
        uint lastIndex = orderIds.length - 1;
        
        if (index != lastIndex) {
            uint lastOrderId = orderIds[lastIndex];
            orderIds[index] = lastOrderId;
            sellOrderIdToIndex[lastOrderId] = index;
        }
        
        orderIds.pop();
        delete sellOrderIdToIndex[orderId];
    }

    function getBuyOrderIds(address token) external view returns (uint[] memory) {
        return buyOrderIdsByToken[token];
    }

    function getSellOrderIds(address token) external view returns (uint[] memory) {
        return sellOrderIdsByToken[token];
    }
}
