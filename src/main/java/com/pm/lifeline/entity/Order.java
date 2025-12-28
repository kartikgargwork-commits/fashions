package com.pm.lifeline.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    private String status;

    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingZip;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    private String trackingNumber;
    private LocalDate estimatedDelivery;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderTracking> trackingEvents;
}


