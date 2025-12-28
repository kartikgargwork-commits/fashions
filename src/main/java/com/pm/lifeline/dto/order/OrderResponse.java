package com.pm.lifeline.dto.order;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private String message;
}

