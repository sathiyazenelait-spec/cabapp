package com.parent.repository;

import com.parent.model.ParentWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentWalletRepository extends JpaRepository<ParentWallet, Long> {
    Optional<ParentWallet> findByParentEmail(String parentEmail);
}
