package com.snumart.supermarket.service;

import com.snumart.supermarket.model.*;
import com.snumart.supermarket.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final InventoryService inventoryService;
    private final CustomerService customerService;
    private final ProductService productService;

    public SaleService(SaleRepository saleRepository, InventoryService inventoryService, 
                       CustomerService customerService, ProductService productService) {
        this.saleRepository = saleRepository;
        this.inventoryService = inventoryService;
        this.customerService = customerService;
        this.productService = productService;
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public List<Sale> getSalesByCustomer(Customer customer) {
        return saleRepository.findByCustomer(customer);
    }

    public List<Sale> getSalesByEmployee(User employee) {
        return saleRepository.findByEmployee(employee);
    }

    public List<Sale> getSalesByDateRange(Date startDate, Date endDate) {
        return saleRepository.findByDateBetween(startDate, endDate);
    }

    @Transactional
    public Sale createSale(Sale sale, List<SaleItem> items) {
        // Set the current date
        sale.setDate(new Date());
        
        // Calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (SaleItem item : items) {
            // Get the product
            Product product = item.getProduct();
            
            // Calculate item total
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setTotal(itemTotal);
            
            // Add to subtotal
            subtotal = subtotal.add(itemTotal);
            
            // Add item to sale
            sale.addItem(item);
            
            // Update inventory
            Optional<Inventory> inventoryOpt = inventoryService.getInventoryByProduct(product);
            if (inventoryOpt.isPresent()) {
                Inventory inventory = inventoryOpt.get();
                inventoryService.updateQuantity(inventory, -item.getQuantity());
            }
        }
        
        // Set sale totals
        sale.setSubtotal(subtotal);
        
        // Calculate tax (assuming 8% tax rate)
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.08));
        sale.setTax(tax);
        
        // Apply discount if any
        BigDecimal discount = sale.getDiscount() != null ? sale.getDiscount() : BigDecimal.ZERO;
        
        // Calculate total
        BigDecimal total = subtotal.add(tax).subtract(discount);
        sale.setTotal(total);
        
        // Save the sale
        Sale savedSale = saleRepository.save(sale);
        
        // Update customer if provided
        if (sale.getCustomer() != null) {
            Customer customer = sale.getCustomer();
            
            // Add loyalty points (1 point per $10 spent)
            int pointsToAdd = total.divide(BigDecimal.valueOf(10)).intValue();
            customerService.addLoyaltyPoints(customer, pointsToAdd);
            
            // Add to purchase history
            customerService.addPurchaseHistory(customer, total, "Sale #" + savedSale.getId());
            
            // Use credit balance if specified
            if (sale.getCreditsUsed() != null && sale.getCreditsUsed().compareTo(BigDecimal.ZERO) > 0) {
                customerService.useCreditBalance(customer, sale.getCreditsUsed());
            }
        }
        
        return savedSale;
    }

    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }
}
