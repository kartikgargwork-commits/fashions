package com.pm.lifeline.repository;

import com.pm.lifeline.entity.Order;
import com.pm.lifeline.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders of a user
    List<Order> findByUser(User user);

    // Get orders by status
    List<Order> findByStatus(String status);

    // Get user orders ordered by latest
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
