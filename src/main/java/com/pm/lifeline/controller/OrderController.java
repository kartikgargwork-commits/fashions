package com.pm.lifeline.controller;

import com.pm.lifeline.dto.order.OrderRequest;
import com.pm.lifeline.dto.order.OrderResponse;
import com.pm.lifeline.entity.User;
import com.pm.lifeline.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Place a new order
     */
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        // ✅ User injected from JWT
        User user = (User) authentication.getPrincipal();

        OrderResponse response = orderService.placeOrder(request, user);

        return ResponseEntity.ok(response);
    }
}
