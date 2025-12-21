package com.nustconnect.backend.Models;

import com.nustconnect.backend.Enums.MarketplaceOrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "marketplace_order", indexes = {
        @Index(name = "idx_buyer_time", columnList = "buyer_id, order_time"),
        @Index(name = "idx_item_status", columnList = "item_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketplaceOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private MarketplaceItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MarketplaceOrderStatus status = MarketplaceOrderStatus.PENDING;

    @NotNull(message = "Order price is required")
    @Column(name = "order_price", nullable = false)
    private Double orderPrice;

    @Size(max = 300)
    @Column(name = "delivery_address", length = 300)
    private String deliveryAddress;

    @Size(max = 20)
    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Size(max = 1000)
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = MarketplaceOrderStatus.PENDING;
        }
    }

    // Helper methods
    public void complete() {
        this.status = MarketplaceOrderStatus.COMPLETED;
    }

    public void cancel() {
        this.status = MarketplaceOrderStatus.CANCELLED;
    }

    public boolean isPending() {
        return this.status == MarketplaceOrderStatus.PENDING;
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MarketplaceItem getItem() {
        return item;
    }

    public void setItem(MarketplaceItem item) {
        this.item = item;
    }

    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
        this.buyer = buyer;
    }

    public MarketplaceOrderStatus getStatus() {
        return status;
    }

    public void setStatus(MarketplaceOrderStatus status) {
        this.status = status;
    }

    public Double getOrderPrice() {
        return orderPrice;
    }

    public void setOrderPrice(Double orderPrice) {
        this.orderPrice = orderPrice;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}