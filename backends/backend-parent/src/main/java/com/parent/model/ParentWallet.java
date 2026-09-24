package com.parent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "parent_wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParentWallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_email", unique = true, nullable = false)
    private String parentEmail;

    private double balance;
}
