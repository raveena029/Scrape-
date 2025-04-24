package com.snumart.supermarket.repository;

import com.snumart.supermarket.model.Inventory;
import com.snumart.supermarket.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProduct(Product product);
    
    @Query("SELECT i FROM Inventory i WHERE i.currentQuantity &lt; i.minimumThreshold")
    List<Inventory> findLowStockItems();
    
    List<Inventory> findByReorderStatus(String status);
}
