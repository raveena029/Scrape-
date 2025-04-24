package com.snumart.supermarket.repository;

import com.snumart.supermarket.model.Section;
import com.snumart.supermarket.model.StoreLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByStoreLayout(StoreLayout storeLayout);
    List<Section> findByType(String type);
}
