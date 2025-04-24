package com.snumart.supermarket.service;

import com.snumart.supermarket.model.Product;
import com.snumart.supermarket.model.Promotion;
import com.snumart.supermarket.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public Optional<Promotion> getPromotionById(Long id) {
        return promotionRepository.findById(id);
    }

    public List<Promotion> getActivePromotions() {
        return promotionRepository.findByIsActive(true);
    }

    public List<Promotion> getPromotionsByProduct(Product product) {
        return promotionRepository.findByProduct(product);
    }

    public List<Promotion> getPromotionsByCategory(String category) {
        return promotionRepository.findByCategory(category);
    }

    public List<Promotion> getGlobalPromotions() {
        return promotionRepository.findByApplicableToAll(true);
    }

    public List<Promotion> getCurrentlyValidPromotions() {
        Date now = new Date();
        return promotionRepository.findByStartDateBeforeAndEndDateAfterAndIsActive(now, now, true);
    }

    public Promotion createPromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public Promotion updatePromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public void deletePromotion(Long id) {
        promotionRepository.deleteById(id);
    }

    public Promotion activatePromotion(Long id) {
        Optional<Promotion> promotionOpt = promotionRepository.findById(id);
        if (promotionOpt.isPresent()) {
            Promotion promotion = promotionOpt.get();
            promotion.setIsActive(true);
            return promotionRepository.save(promotion);
        }
        throw new RuntimeException("Promotion not found with id: " + id);
    }

    public Promotion deactivatePromotion(Long id) {
        Optional<Promotion> promotionOpt = promotionRepository.findById(id);
        if (promotionOpt.isPresent()) {
            Promotion promotion = promotionOpt.get();
            promotion.setIsActive(false);
            return promotionRepository.save(promotion);
        }
        throw new RuntimeException("Promotion not found with id: " + id);
    }
}
