package com.snumart.supermarket.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sections")
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "store_layout_id", nullable = false)
    private StoreLayout storeLayout;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Embedded
    private Dimension dimensions;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SectionProduct> products = new ArrayList<>();

    public Section() {
    }

    public Section(String name, String type, Dimension dimensions) {
        this.name = name;
        this.type = type;
        this.dimensions = dimensions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StoreLayout getStoreLayout() {
        return storeLayout;
    }

    public void setStoreLayout(StoreLayout storeLayout) {
        this.storeLayout = storeLayout;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Dimension getDimensions() {
        return dimensions;
    }

    public void setDimensions(Dimension dimensions) {
        this.dimensions = dimensions;
    }

    public List<SectionProduct> getProducts() {
        return products;
    }

    public void setProducts(List<SectionProduct> products) {
        this.products = products;
    }

    public void addProduct(SectionProduct product) {
        products.add(product);
        product.setSection(this);
    }

    public void removeProduct(SectionProduct product) {
        products.remove(product);
        product.setSection(null);
    }
}
