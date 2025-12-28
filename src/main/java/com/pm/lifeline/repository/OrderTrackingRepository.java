package com.pm.lifeline.repository;

import com.pm.lifeline.entity.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Long> {
}
