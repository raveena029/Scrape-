package com.snumart.supermarket.repository;

import com.snumart.supermarket.model.Product;
import com.snumart.supermarket.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByIsActive(Boolean isActive);
    List<Promotion> findByProduct(Product product);
    List<Promotion> findByCategory(String category);
    List<Promotion> findByApplicableToAll(Boolean applicableToAll);
    List<Promotion> findByStartDateBeforeAndEndDateAfterAndIsActive(Date date, Date sameDate, Boolean isActive);
}
