package com.snumart.supermarket.repository;

import com.snumart.supermarket.model.Report;
import com.snumart.supermarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportType(String reportType);
    List<Report> findByGeneratedBy(User user);
    List<Report> findByGenerationDateBetween(Date startDate, Date endDate);
}
