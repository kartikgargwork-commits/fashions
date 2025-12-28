package com.pm.lifeline.service;

import com.pm.lifeline.dto.order.OrderItemRequest;
import com.pm.lifeline.dto.order.OrderRequest;
import com.pm.lifeline.dto.order.OrderResponse;
import com.pm.lifeline.entity.Order;
import com.pm.lifeline.entity.OrderItem;
import com.pm.lifeline.entity.OrderTracking;
import com.pm.lifeline.entity.User;
import com.pm.lifeline.repository.OrderItemRepository;
import com.pm.lifeline.repository.OrderRepository;
import com.pm.lifeline.repository.OrderTrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderTrackingRepository orderTrackingRepository;

    /**
     * Place a new order
     */
    public OrderResponse placeOrder(OrderRequest request, User user) {

        // 1️⃣ Create Order
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PLACED");
        order.setTotalAmount(calculateTotal(request.getItems()));

        Order savedOrder = orderRepository.save(order);

        // 2️⃣ Save Order Items
        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProductId(itemReq.getProductId());
            item.setProductName(itemReq.getName());
            item.setProductImage(itemReq.getImage());
            item.setPrice(itemReq.getPrice());
            item.setQuantity(itemReq.getQuantity());
            return item;
        }).toList();

        orderItemRepository.saveAll(items);

        // 3️⃣ Initial Order Tracking
        OrderTracking tracking = new OrderTracking();
        tracking.setOrder(savedOrder);
        tracking.setStatus("ORDER_PLACED");
        tracking.setDescription("Order has been placed successfully");

        orderTrackingRepository.save(tracking);

        return new OrderResponse(
                savedOrder.getId(),
                "Order placed successfully"
        );
    }

    /**
     * Calculate total price
     */
    private Double calculateTotal(List<OrderItemRequest> items) {
        return items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
    }
}
