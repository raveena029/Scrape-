package com.snumart.supermarket.service;

import com.snumart.supermarket.model.Section;
import com.snumart.supermarket.model.SectionProduct;
import com.snumart.supermarket.model.StoreLayout;
import com.snumart.supermarket.repository.SectionRepository;
import com.snumart.supermarket.repository.StoreLayoutRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreLayoutService {

    private final StoreLayoutRepository storeLayoutRepository;
    private final SectionRepository sectionRepository;

    public StoreLayoutService(StoreLayoutRepository storeLayoutRepository, SectionRepository sectionRepository) {
        this.storeLayoutRepository = storeLayoutRepository;
        this.sectionRepository = sectionRepository;
    }

    public List<StoreLayout> getAllLayouts() {
        return storeLayoutRepository.findAll();
    }

    public Optional<StoreLayout> getLayoutById(Long id) {
        return storeLayoutRepository.findById(id);
    }

    public StoreLayout getLayoutByName(String name) {
        return storeLayoutRepository.findByName(name);
    }

    public StoreLayout createLayout(StoreLayout layout) {
        return storeLayoutRepository.save(layout);
    }

    public StoreLayout updateLayout(StoreLayout layout) {
        return storeLayoutRepository.save(layout);
    }

    public void deleteLayout(Long id) {
        storeLayoutRepository.deleteById(id);
    }

    public List<Section> getSectionsByLayout(StoreLayout layout) {
        return sectionRepository.findByStoreLayout(layout);
    }

    public List<Section> getSectionsByType(String type) {
        return sectionRepository.findByType(type);
    }

    public Optional<Section> getSectionById(Long id) {
        return sectionRepository.findById(id);
    }

    public Section createSection(Section section, StoreLayout layout) {
        section.setStoreLayout(layout);
        return sectionRepository.save(section);
    }

    public Section updateSection(Section section) {
        return sectionRepository.save(section);
    }

    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }

    public Section addProductToSection(Section section, SectionProduct product) {
        section.addProduct(product);
        return sectionRepository.save(section);
    }

    public Section removeProductFromSection(Section section, SectionProduct product) {
        section.removeProduct(product);
        return sectionRepository.save(section);
    }
}
