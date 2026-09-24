package com.driver.repository;

import com.driver.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPayerEmail(String payerEmail);
    List<Payment> findByInvoiceNo(String invoiceNo);
}
