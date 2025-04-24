package com.snumart.supermarket.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(precision = 10, scale = 2)
    private BigDecimal discount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column
    private BigDecimal creditsUsed;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleItem> items = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "sale_promotions",
        joinColumns = @JoinColumn(name = "sale_id"),
        inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    private List<Promotion> appliedPromotions = new ArrayList<>();

    public Sale() {
    }

    public Sale(User employee, Date date, BigDecimal subtotal, BigDecimal tax, BigDecimal discount, BigDecimal total) {
        this.employee = employee;
        this.date = date;
        this.subtotal = subtotal;
        this.tax = tax;
        this.discount = discount;
        this.total = total;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public BigDecimal getCreditsUsed() {
        return creditsUsed;
    }

    public void setCreditsUsed(BigDecimal creditsUsed) {
        this.creditsUsed = creditsUsed;
    }

    public List<SaleItem> getItems() {
        return items;
    }

    public void setItems(List<SaleItem> items) {
        this.items = items;
    }

    public void addItem(SaleItem item) {
        items.add(item);
        item.setSale(this);
    }

    public void removeItem(SaleItem item) {
        items.remove(item);
        item.setSale(null);
    }

    public List<Promotion> getAppliedPromotions() {
        return appliedPromotions;
    }

    public void setAppliedPromotions(List<Promotion> appliedPromotions) {
        this.appliedPromotions = appliedPromotions;
    }
}
