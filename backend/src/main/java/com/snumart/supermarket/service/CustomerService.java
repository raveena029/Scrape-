package com.snumart.supermarket.service;

import com.snumart.supermarket.model.Customer;
import com.snumart.supermarket.model.PurchaseHistory;
import com.snumart.supermarket.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public List<Customer> searchCustomers(String query) {
        return customerRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Customer> getCustomersWithLoyaltyPoints(int minPoints) {
        return customerRepository.findByLoyaltyPointsGreaterThan(minPoints);
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public Customer addLoyaltyPoints(Customer customer, int points) {
        customer.setLoyaltyPoints(customer.getLoyaltyPoints() + points);
        return customerRepository.save(customer);
    }

    public Customer addCreditBalance(Customer customer, BigDecimal amount) {
        customer.setCreditBalance(customer.getCreditBalance().add(amount));
        return customerRepository.save(customer);
    }

    public boolean useCreditBalance(Customer customer, BigDecimal amount) {
        if (customer.getCreditBalance().compareTo(amount) >= 0) {
            customer.setCreditBalance(customer.getCreditBalance().subtract(amount));
            customerRepository.save(customer);
            return true;
        }
        return false;
    }

    public Customer addPurchaseHistory(Customer customer, BigDecimal amount, String details) {
        PurchaseHistory purchase = new PurchaseHistory(new Date(), amount, details);
        customer.addPurchase(purchase);
        return customerRepository.save(customer);
    }
}
