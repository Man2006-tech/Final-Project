package com.nustconnect.backend;

import com.nustconnect.backend.Enums.UserRole;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@SpringBootApplication
public class NustconnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(NustconnectApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository userRepository,
										 PasswordEncoder passwordEncoder) {
		return args -> {
			// Create admin user
			String adminEmail = "admin@seecs.edu.pk";
			if (!userRepository.existsByEmail(adminEmail)) {
				User admin = User.builder()
						.name("System Admin")
						.email(adminEmail)
						.passwordHash(passwordEncoder.encode("seecs123"))
						.role(UserRole.ADMIN)
						.department("Administration")
						.isActive(true)
						.isEmailVerified(true)
						.verificationToken(UUID.randomUUID().toString())
						.build();
				userRepository.save(admin);
				System.out.println("Admin account created: " + adminEmail);
			}
		};
	}

}
