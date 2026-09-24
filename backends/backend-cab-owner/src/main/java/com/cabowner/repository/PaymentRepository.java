package com.cabowner.repository;

import com.cabowner.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByRecipientEmailOrType(String recipientEmail, String type);
    List<Payment> findByRecipientEmail(String recipientEmail);
}
