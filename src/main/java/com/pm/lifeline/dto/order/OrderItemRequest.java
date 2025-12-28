package com.pm.lifeline.dto.order;


import lombok.Data;

@Data
public class OrderItemRequest {

    private Long productId;
    private String name;
    private String image;
    private Double price;
    private Integer quantity;
}

