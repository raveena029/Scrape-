package com.snumart.supermarket.repository;

import com.snumart.supermarket.model.StoreLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreLayoutRepository extends JpaRepository<StoreLayout, Long> {
    StoreLayout findByName(String name);
}
