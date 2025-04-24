package com.snumart.supermarket.service;

import com.snumart.supermarket.model.Inventory;
import com.snumart.supermarket.model.Product;
import com.snumart.supermarket.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    public Optional<Inventory> getInventoryByProduct(Product product) {
        return inventoryRepository.findByProduct(product);
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    public List<Inventory> getItemsByReorderStatus(String status) {
        return inventoryRepository.findByReorderStatus(status);
    }

    public Inventory createInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Inventory inventory) {
        // Check if inventory needs reordering
        if (inventory.getCurrentQuantity() &lt; inventory.getMinimumThreshold()) {
            inventory.setReorderStatus("Reorder Needed");
        } else {
            inventory.setReorderStatus("Normal");
        }
        
        return inventoryRepository.save(inventory);
    }

    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

    public Inventory updateQuantity(Inventory inventory, int quantityChange) {
        int newQuantity = inventory.getCurrentQuantity() + quantityChange;
        
        // Ensure quantity doesn't go below 0
        inventory.setCurrentQuantity(Math.max(0, newQuantity));
        
        // Update reorder status
        if (inventory.getCurrentQuantity() &lt; inventory.getMinimumThreshold()) {
            inventory.setReorderStatus("Reorder Needed");
        } else {
            inventory.setReorderStatus("Normal");
        }
        
        return inventoryRepository.save(inventory);
    }

    public Inventory restockInventory(Inventory inventory, int quantity) {
        inventory.setCurrentQuantity(inventory.getCurrentQuantity() + quantity);
        inventory.setLastRestockDate(new Date());
        
        // Update reorder status
        if (inventory.getCurrentQuantity() &lt; inventory.getMinimumThreshold()) {
            inventory.setReorderStatus("Reorder Needed");
        } else {
            inventory.setReorderStatus("Normal");
        }
        
        return inventoryRepository.save(inventory);
    }
}
