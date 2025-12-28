package com.pm.lifeline.dto.order;



import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {

    private ShippingInfo shippingInfo;
    private List<OrderItemRequest> items;

    @Data
    public static class ShippingInfo {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }
}
