package com.snumart.supermarket.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reportType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Date generationDate;

    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date endDate;

    @Column(columnDefinition = "TEXT")
    private String data;

    @


Let's fix the Report model:

```java file="backend/src/main/java/com/snumart/supermarket/model/Report.java" isFixed
package com.snumart.supermarket.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reportType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Date generationDate;

    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date endDate;

    @Column(columnDefinition = "TEXT")
    private String data;

    @ManyToOne
    @JoinColumn(name = "generated_by")
    private User generatedBy;

    public Report() {
    }

    public Report(String reportType, String title, Date generationDate, Date startDate, Date endDate, String data, User generatedBy) {
        this.reportType = reportType;
        this.title = title;
        this.generationDate = generationDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.data = data;
        this.generatedBy = generatedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getGenerationDate() {
        return generationDate;
    }

    public void setGenerationDate(Date generationDate) {
        this.generationDate = generationDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public User getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(User generatedBy) {
        this.generatedBy = generatedBy;
    }
}
